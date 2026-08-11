-- Migration: 08_coop_streak_and_freeze.sql
ALTER TABLE public.streaks 
  ADD COLUMN IF NOT EXISTS user1_completed_today BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS user2_completed_today BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS freeze_count INT DEFAULT 2, -- 기본 스트릭 보존권 2개 지급
  ADD COLUMN IF NOT EXISTS last_freeze_used_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_streak_increment_date DATE; -- 스트릭 중복 증가 방지용 날짜 컬럼 추가

-- 자정 기준 당일 학습 완료 여부 초기화 및 Streak 계산 함수
CREATE OR REPLACE FUNCTION public.check_and_update_coop_streak(target_couple_id UUID)
RETURNS VOID AS $$
DECLARE
    st RECORD;
BEGIN
    SELECT * INTO st FROM public.streaks WHERE couple_id = target_couple_id;
    
    -- 둘 다 완료했을 때만 & 오늘 스트릭이 아직 증가하지 않았을 때만 Streak +1
    IF st.user1_completed_today AND st.user2_completed_today 
       AND (st.last_streak_increment_date IS DISTINCT FROM st.last_study_date) THEN
        UPDATE public.streaks 
        SET current_streak = current_streak + 1,
            last_streak_increment_date = st.last_study_date,
            updated_at = NOW()
        WHERE couple_id = target_couple_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
