-- Migration: 09_atomic_offline_sync_rpc.sql
CREATE OR REPLACE FUNCTION public.sync_offline_study_session(
    p_user_id UUID,
    p_couple_id UUID,
    p_local_date DATE,
    p_concept_ids UUID[],
    p_xp_gained INT DEFAULT 100
)
RETURNS JSONB AS $$
DECLARE
    c_id UUID;
    v_u1_id UUID;
    v_u2_id UUID;
    v_last_date DATE;
BEGIN
    -- 0. 오늘 날짜가 last_study_date와 다르면 completed_today 플래그 초기화
    SELECT last_study_date INTO v_last_date FROM public.streaks WHERE couple_id = p_couple_id;
    IF v_last_date IS DISTINCT FROM p_local_date THEN
        UPDATE public.streaks
        SET user1_completed_today = false,
            user2_completed_today = false
        WHERE couple_id = p_couple_id;
    END IF;

    -- 1. study_logs 삽입 (중복 시 무시)
    INSERT INTO public.study_logs (user_id, couple_id, local_date, xp_gained)
    VALUES (p_user_id, p_couple_id, p_local_date, p_xp_gained)
    ON CONFLICT (user_id, local_date) DO NOTHING;

    -- 2. user_studied_words 대량 삽입 (중복 시 무시)
    IF p_concept_ids IS NOT NULL AND array_length(p_concept_ids, 1) > 0 THEN
        FOREACH c_id IN ARRAY p_concept_ids LOOP
            INSERT INTO public.user_studied_words (user_id, concept_id)
            VALUES (p_user_id, c_id)
            ON CONFLICT (user_id, concept_id) DO NOTHING;
        END LOOP;
    END IF;

    -- 3. couples에서 user1_id, user2_id 확인
    SELECT user1_id, user2_id INTO v_u1_id, v_u2_id
    FROM public.couples
    WHERE id = p_couple_id;

    -- 4. streaks 당일 학습 상태 갱신
    UPDATE public.streaks
    SET user1_completed_today = CASE WHEN v_u1_id = p_user_id THEN true ELSE user1_completed_today END,
        user2_completed_today = CASE WHEN v_u2_id = p_user_id THEN true ELSE user2_completed_today END,
        last_study_date = p_local_date,
        updated_at = NOW()
    WHERE couple_id = p_couple_id;

    -- 5. 양쪽 모두 완수 시 Streak +1
    PERFORM public.check_and_update_coop_streak(p_couple_id);

    RETURN jsonb_build_object('success', true, 'message', 'Atomic Sync Complete');
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Atomic Sync Failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
