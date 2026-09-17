const views = document.querySelectorAll('.view');
const navItems = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('pageTitle');
const sidebar = document.getElementById('sidebar');
const mobileMenu = document.getElementById('mobileMenu');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalForm = document.getElementById('modalForm');
const toast = document.getElementById('toast');

const titles = {
  dashboard: 'Dashboard',
  cuenta: 'Estado de cuenta',
  pagos: 'Pagos',
  reservas: 'Reservas',
  visitas: 'Visitas',
  incidencias: 'Incidencias',
  comunicados: 'Comunicados'
};

function showView(viewId) {
  views.forEach(view => view.classList.toggle('active', view.id === viewId));
  navItems.forEach(item => item.classList.toggle('active', item.dataset.view === viewId));
  pageTitle.textContent = titles[viewId] || 'CondoHub';
  sidebar.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navItems.forEach(item => {
  item.addEventListener('click', () => showView(item.dataset.view));
});

document.querySelectorAll('[data-view-target]').forEach(button => {
  button.addEventListener('click', () => showView(button.dataset.viewTarget));
});

mobileMenu?.addEventListener('click', () => sidebar.classList.toggle('open'));

document.addEventListener('click', event => {
  if (window.innerWidth <= 780 && sidebar.classList.contains('open')) {
    const clickedInsideSidebar = sidebar.contains(event.target);
    const clickedMenuButton = mobileMenu?.contains(event.target);
    if (!clickedInsideSidebar && !clickedMenuButton) sidebar.classList.remove('open');
  }
});

function openModal(type = 'pago', space = '') {
  if (type === 'reserva') {
    modalTitle.textContent = space ? `Reservar ${space}` : 'Nueva reserva';
    modalDescription.textContent = 'Selecciona una fecha y horario para simular una reserva.';
  } else if (type === 'visita') {
    modalTitle.textContent = 'Autorizar visita';
    modalDescription.textContent = 'Registra un invitado para simular una autorización de acceso.';
  } else if (type === 'incidencia') {
    modalTitle.textContent = 'Nueva incidencia';
    modalDescription.textContent = 'Describe el problema para simular el registro de una incidencia.';
  } else {
    modalTitle.textContent = 'Registrar pago';
    modalDescription.textContent = 'Completa los datos para simular esta operación.';
  }

  modalBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalBackdrop.hidden = true;
  document.body.style.overflow = '';
}

function showToast(message = 'Operación simulada correctamente.') {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

document.querySelectorAll('[data-action="nuevo-pago"]').forEach(button => {
  button.addEventListener('click', () => openModal('pago'));
});

document.querySelectorAll('.reserve-btn').forEach(button => {
  button.addEventListener('click', () => openModal('reserva', button.dataset.space));
});

document.getElementById('newReservation')?.addEventListener('click', () => openModal('reserva'));
document.getElementById('newVisit')?.addEventListener('click', () => openModal('visita'));
document.getElementById('newIssue')?.addEventListener('click', () => openModal('incidencia'));

modalClose?.addEventListener('click', closeModal);
modalCancel?.addEventListener('click', closeModal);
modalBackdrop?.addEventListener('click', event => {
  if (event.target === modalBackdrop) closeModal();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !modalBackdrop.hidden) closeModal();
});

modalForm?.addEventListener('submit', event => {
  event.preventDefault();
  closeModal();
  showToast();
});

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    showToast(`Filtro "${button.textContent.trim()}" aplicado en el prototipo.`);
  });
});
