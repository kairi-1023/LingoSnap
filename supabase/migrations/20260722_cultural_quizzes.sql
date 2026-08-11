-- Create cultural_quizzes table
CREATE TABLE IF NOT EXISTS public.cultural_quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  native_lang TEXT NOT NULL DEFAULT 'Korean',
  target_lang TEXT NOT NULL DEFAULT 'English',
  category TEXT NOT NULL DEFAULT 'dating',
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  cultural_insight TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cultural_quizzes ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users
CREATE POLICY "Allow public read access to cultural_quizzes"
  ON public.cultural_quizzes FOR SELECT
  USING (true);

-- Allow authenticated users to insert/update (for caching)
CREATE POLICY "Allow write access to authenticated users on cultural_quizzes"
  ON public.cultural_quizzes FOR INSERT
  WITH CHECK (true);

-- Insert Rich Seed Data for Multi-language Couples (Korean <-> English, Tagalog, Spanish, Chinese, Japanese)

-- 1. Tagalog (Filipino)
INSERT INTO public.cultural_quizzes (native_lang, target_lang, category, question, options, correct_answer, cultural_insight) VALUES
('Korean', 'Tagalog', 'greeting', 
 '필리핀(Tagalog) 연인이 식사 때 "Kumain ka na?" 라고 묻는 표현의 가장 알맞은 문화적 의미는?', 
 '["진짜 밥만 먹었는지 확인하는 질문", "상대방의 건강과 하루를 챙기는 따뜻한 안부 표현", "식사 비용을 더치페이하자고 제안하는 말", "식당 위치를 물어보는 말"]'::jsonb, 
 '상대방의 건강과 하루를 챙기는 따뜻한 안부 표현', 
 '💡 필리핀에서는 "Kumain ka na?"(밥 먹었어?)가 한국의 "밥 먹었어?"처럼 상대방을 다정하게 챙기는 대표적인 애정 안부 표현입니다!'),

('Korean', 'Tagalog', 'manners', 
 '필리핀에서 파트너나 존경하는 손윗사람에게 존중을 표할 때 문장 끝에 붙이는 다정한 어휘는?', 
 '["Po / Opo", "Salamat", "Mabuhay", "Kamusta"]'::jsonb, 
 'Po / Opo', 
 '💡 "Po"와 "Opo"는 필리핀 문화에서 예의와 깊은 존중을 담아 마음을 전하는 중요한 문화적 어휘입니다.');

-- 2. Spanish
INSERT INTO public.cultural_quizzes (native_lang, target_lang, category, question, options, correct_answer, cultural_insight) VALUES
('Korean', 'Spanish', 'greeting', 
 '스페인/라틴 연인이 만나서 인사할 때 "Dos Besos" (양 볼 가벼운 인사)를 건네는 문화적 의미는?', 
 '["격식 차린 비즈니스 인사", "상대방을 친근하고 다정하게 환영하는 따뜻한 문화적 표현", "비밀을 말해달라는 신호", "싸우자는 뜻"]'::jsonb, 
 '상대방을 친근하고 다정하게 환영하는 따뜻한 문화적 표현', 
 '💡 스페인 및 라틴 아메리카에서는 연인과 친한 사람을 만날 때 양 볼을 살짝 대며 인사하는 "Dos Besos"로 따뜻한 애정을 표현합니다.'),

('Korean', 'Spanish', 'dating', 
 '스페인어권 파트너가 연인을 부를 때 자주 쓰는 "Cariño (까리뇨)" 또는 "Mi vida (미 비다)"의 뜻은?', 
 '["내 귀염둥이 / 내 전부(내 삶)", "친한 친구", "선생님", "동료"]'::jsonb, 
 '내 귀염둥이 / 내 전부(내 삶)', 
 '💡 스페인어권에서는 연인을 부를 때 "Cariño"(내 사랑/귀염둥이), "Mi vida"(내 삶/내 전부) 같은 낭만적이고 열정적인 호칭을 아낌없이 사용합니다.');

-- 3. English
INSERT INTO public.cultural_quizzes (native_lang, target_lang, category, question, options, correct_answer, cultural_insight) VALUES
('Korean', 'English', 'dating', 
 '영어권 파트너가 "How was your day?" 라고 물었을 때 가장 자연스러운 반응의 문화적 의미는?', 
 '["오늘 있었던 시간대별 전체 일정을 1시간씩 보고하기", "오늘의 느낌과 주요 일화 1-2개로 다정하게 소통 시작하기", "아무 말 없이 미소만 짓기", "비밀이라고 말하기"]'::jsonb, 
 '오늘의 느낌과 주요 일화 1-2개로 다정하게 소통 시작하기', 
 '💡 "How was your day?"는 단순 질문이 아니라, 파트너와 오늘 하루 동안 느꼈던 감정과 이야기를 대화로 편안히 나누기 위한 초대 인사입니다.'),

('Korean', 'English', 'dating', 
 '영어권에서 데이트 중 파트너가 "I am so proud of you"라고 말했을 때 담긴 깊은 뜻은?', 
 '["자신의 성과를 자랑하는 말", "당신의 노력과 작은 도전을 함께 기뻐하고 아껴주는 마음", "시험 점수를 물어보는 말", "조용히 하라는 말"]'::jsonb, 
 '당신의 노력과 작은 도전을 함께 기뻐하고 아껴주는 마음', 
 '💡 영어권 연인 사이에서 "I proud of you"는 존경과 아낌없는 응원을 전하는 아주 깊은 애정 표현입니다.');

-- 4. Chinese
INSERT INTO public.cultural_quizzes (native_lang, target_lang, category, question, options, correct_answer, cultural_insight) VALUES
('Korean', 'Chinese', 'greeting', 
 '중국어권 파트너가 "你吃饭了吗?" (Nǐ chīfàn le ma?)라고 자주 묻는 진짜 이유는?', 
 '["음식을 사달라는 요청", "상대방을 향한 가장 친근하고 따뜻한 일상 안부 인사", "다이어트 중인지 확인하기 위해", "요리 실력을 자랑하기 위해"]'::jsonb, 
 '상대방을 향한 가장 친근하고 따뜻한 일상 안부 인사', 
 '💡 중국 문화에서도 "밥 먹었어?"(你吃饭了吗)는 상대방을 살뜰하게 걱정하고 챙기는 최고의 안부 표현입니다.');

-- 5. Japanese
INSERT INTO public.cultural_quizzes (native_lang, target_lang, category, question, options, correct_answer, cultural_insight) VALUES
('Korean', 'Japanese', 'dating', 
 '일본어권 연인이 힘든 하루를 마쳤을 때 "お疲れ様 (오츠카레사마)" 라고 말하는 따뜻한 마음의 뜻은?', 
 '["오늘 하루 피곤하니까 말시키지 말라는 뜻", "오늘 하루도 정말 애쓰고 수고했다는 위로와 격려의 마음", "내일 일찍 출근하라는 의미", "운동하러 가자는 뜻"]'::jsonb, 
 '오늘 하루도 정말 애쓰고 수고했다는 위로와 격려의 마음', 
 '💡 "お疲れ様"는 일상에서 연인끼리 서로의 노력과 노고를 진심으로 인정해주고 다독여주는 따뜻한 표현입니다.');
