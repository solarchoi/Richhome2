// 샘플 초기 데이터
const defaultCards = [
  {
    id: 1,
    title: 'AI 프롬프트 구조화 팁',
    category: '프롬프트',
    content: '역할(Role) -> 배경(Context) -> 제약사항(Constraint) -> 출력형식(Format) 순서로 명확하게 작성해보세요.',
    likes: 12,
    date: '2026. 10. 28'
  },
  {
    id: 2,
    title: '엑셀 자동화 Python 스크립트',
    category: '자동화',
    content: 'Openpyxl 라이브러리로 수백 개의 엑셀 파일 데이터를 단 몇 초 만에 병합하는 자동화 도구 구축 성공.',
    likes: 8,
    date: '2026. 10. 30'
  },
  {
    id: 3,
    title: 'LLM 업무 활용 시 주의사항',
    category: '인사이트',
    content: '민감한 개인정보 및 내부 보안 문서는 프롬프트 입력 시 비식별화 처리를 반드시 진행해야 합니다.',
    likes: 15,
    date: '2026. 11. 02'
  }
];

// LocalStorage 연동
let cards = JSON.parse(localStorage.getItem('padlet_modern_cards')) || defaultCards;

// 로컬 저장 함수
function saveCards() {
  localStorage.setItem('padlet_modern_cards', JSON.stringify(cards));
}

// 카드리스트 렌더링
function renderCards(filterText = '') {
  const grid = document.getElementById('cardGrid');
  const emptyState = document.getElementById('emptyState');
  grid.innerHTML = '';

  const filtered = cards.filter(c => 
    c.title.toLowerCase().includes(filterText.toLowerCase()) || 
    c.content.toLowerCase().includes(filterText.toLowerCase()) ||
    c.category.toLowerCase().includes(filterText.toLowerCase())
  );

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  filtered.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.innerHTML = `
      <div>
        <span class="card-tag">${escapeHtml(card.category)}</span>
        <h3 class="card-title">${escapeHtml(card.title)}</h3>
        <p class="card-body">${escapeHtml(card.content)}</p>
      </div>
      <div class="card-footer">
        <span><i class="fa-regular fa-clock"></i> ${card.date}</span>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button class="like-btn" onclick="toggleLike(${card.id})">
            <i class="fa-solid fa-heart"></i>
            <span>${card.likes}</span>
          </button>
          <button class="delete-btn" onclick="deleteCard(${card.id})" title="삭제">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(cardEl);
  });
}

// 모달 열기/닫기
function openModal() {
  document.getElementById('modalOverlay').style.display = 'flex';
  document.getElementById('cardTitle').focus();
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
  document.getElementById('cardTitle').value = '';
  document.getElementById('cardContent').value = '';
}

// 새 카드 등록
function addCard() {
  const title = document.getElementById('cardTitle').value.trim();
  const category = document.getElementById('cardCategory').value;
  const content = document.getElementById('cardContent').value.trim();

  if (!title || !content) {
    alert('제목과 내용을 입력해 주세요.');
    return;
  }

  const today = new Date();
  const dateStr = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}`;

  const newCard = {
    id: Date.now(),
    title: title,
    category: category,
    content: content,
    likes: 0,
    date: dateStr
  };

  cards.unshift(newCard);
  saveCards();
  renderCards();
  closeModal();
}

// 좋아요 토글
function toggleLike(id) {
  const card = cards.find(c => c.id === id);
  if (card) {
    card.likes += 1;
    saveCards();
    renderCards(document.getElementById('searchInput').value);
  }
}

// 카드 삭제
function deleteCard(id) {
  if (confirm('이 카드를 정말 삭제하시겠습니까?')) {
    cards = cards.filter(c => c.id !== id);
    saveCards();
    renderCards(document.getElementById('searchInput').value);
  }
}

// 검색 필터링
function filterCards() {
  const query = document.getElementById('searchInput').value;
  renderCards(query);
}

// HTML 이스케이프 (XSS 방지)
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// 초기화
window.onload = function() {
  renderCards();
};