-- 샘플 작품 (선택). schema.sql 실행 후 실행한다.
insert into public.series (title, creator, genre, status, release_day, orientation, episode_count, description) values
('마지막 마녀', 'lyra', 'fantasy', 'ongoing', 'mon', 'vertical', 13, '멸망한 왕국의 마지막 마녀 엘라라가 처형대 위에서 눈을 뜬다. 10년 전, 모든 것이 무너지기 직전의 그날로.'),
('회귀한 재벌 3세는 복수를 미루지 않는다', '오늘도야근', 'regression', 'ongoing', 'wed', 'vertical', 27, '형에게 모든 것을 빼앗기고 죽은 날, 스무 살의 아침으로 돌아왔다. 이번엔 한 화도 참지 않는다.'),
('편의점 밤 근무 수칙', '새벽세시', 'horror', 'ongoing', 'fri', 'vertical', 9, '새벽 3시 33분에는 계산대에서 고개를 들지 마세요. 수칙 7번은 아직 아무도 읽지 못했다.'),
('계약 연애의 유효기간', '봄날의곰', 'romance', 'completed', null, 'vertical', 40, '100일만 사귀는 척하기로 했다. 99일째 되는 날, 계약서 마지막 장에 없던 조항이 생겼다.'),
('궤도 위의 마지막 택배', 'orbit_kim', 'scifi', 'hiatus', null, 'horizontal', 6, '2087년, 정지 궤도 위 폐쇄된 정거장으로 마지막 택배를 배달하러 간 배달원 이야기.'),
('형사 윤서진의 오답노트', '케이스파일', 'mystery', 'ongoing', 'sat', 'vertical', 18, '모두가 자살이라고 한 사건 열두 개. 서진의 노트에는 같은 이름이 열두 번 적혀 있었다.'),
('우리 집 고양이가 이세계 마왕', '츄르연구소', 'comedy', 'completed', null, 'vertical', 24, '퇴근하고 오니 고양이가 말을 한다. 자기가 마왕이었다고. 일단 밥부터 달라고.'),
('검은 비가 내리는 도시', '느와르킹', 'action', 'ongoing', 'mon', 'horizontal', 11, '조직에서 버려진 해결사가 마지막 의뢰를 받는다. 대상은 10년 전 자신이 지켜야 했던 아이.');
