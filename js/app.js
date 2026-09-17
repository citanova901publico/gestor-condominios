const views = document.querySelectorAll('.view');
const navItems = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('pageTitle');
const contextLabel = document.getElementById('contextLabel');
const sidebar = document.getElementById('sidebar');
const mobileMenu = document.getElementById('mobileMenu');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const dynamicForm = document.getElementById('dynamicForm');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const modalForm = document.getElementById('modalForm');
const toast = document.getElementById('toast');
const roleSelect = document.getElementById('roleSelect');
const profileName = document.getElementById('profileName');
const profileRole = document.getElementById('profileRole');
const avatar = document.getElementById('avatar');
const contextAction = document.getElementById('contextAction');
const residentWelcome = document.getElementById('residentWelcome');
const adminWelcome = document.getElementById('adminWelcome');
const residentStats = document.getElementById('residentStats');
const adminStats = document.getElementById('adminStats');
const financePanelTitle = document.getElementById('financePanelTitle');
const financeAmount = document.getElementById('financeAmount');
const financeCaption = document.getElementById('financeCaption');
const quickActions = document.getElementById('quickActions');

const titles = {
  dashboard:'Dashboard', cuenta:'Estado de cuenta', pagos:'Pagos y evidencias', reservas:'Reservas', visitas:'Visitas', incidencias:'Incidencias', comunicados:'Comunicados', estructura:'Condominios y unidades', usuarios:'Usuarios y perfiles', cargos:'Cargos y multas', documentos:'Documentos', reportes:'Reportes', auditoria:'Auditoría'
};

const roles = {
  propietario:{name:'Carlos A.',detail:'Propietario · Dpto. 704',initials:'CA',context:'Mi residencia',admin:false},
  inquilino:{name:'Lucía Torres',detail:'Inquilina · Dpto. 704',initials:'LT',context:'Mi residencia',admin:false},
  administrador:{name:'María Rojas',detail:'Administrador · Residencial Central',initials:'MR',context:'Administración',admin:true},
  supervisor:{name:'Luis Vega',detail:'Supervisor · Torre A',initials:'LV',context:'Supervisión',admin:true},
  junta:{name:'Ana Salazar',detail:'Junta Directiva',initials:'AS',context:'Junta Directiva',admin:true}
};

function showView(viewId){
  const target = document.getElementById(viewId);
  if(!target || target.classList.contains('role-hidden')) return;
  views.forEach(v=>v.classList.toggle('active',v.id===viewId));
  navItems.forEach(i=>i.classList.toggle('active',i.dataset.view===viewId));
  pageTitle.textContent=titles[viewId]||'CondoHub';
  sidebar.classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
}

function allowedFor(item, role){
  const allowed=item.dataset.roles||'all';
  return allowed==='all' || allowed.split(' ').includes(role);
}

function applyRole(role){
  const config=roles[role];
  document.body.classList.toggle('admin-mode',config.admin);
  profileName.textContent=config.name;
  profileRole.textContent=config.detail;
  avatar.textContent=config.initials;
  contextLabel.textContent=config.context;

  navItems.forEach(item=>{
    const allowed=allowedFor(item,role);
    item.classList.toggle('role-hidden',!allowed);
    item.style.display=allowed ? '' : 'none';
  });

  const isResident=role==='propietario'||role==='inquilino';
  residentWelcome.classList.toggle('hidden',!isResident);
  residentStats.classList.toggle('hidden',!isResident);
  adminWelcome.classList.toggle('hidden',isResident);
  adminStats.classList.toggle('hidden',isResident);

  if(isResident){
    financePanelTitle.textContent='Estado de cuenta';
    financeAmount.textContent='S/ 1,420.00';
    financeCaption.textContent='Pagado este mes';
    contextAction.textContent='+ Registrar pago';
    contextAction.dataset.modal='pago';
    quickActions.innerHTML='<button data-view-target="pagos"><span>✓</span><strong>Registrar pago</strong><small>Adjunta tu comprobante</small></button><button data-view-target="reservas"><span>▦</span><strong>Reservar ambiente</strong><small>Consulta disponibilidad</small></button><button data-view-target="visitas"><span>♙</span><strong>Autorizar visita</strong><small>Registra un invitado</small></button><button data-view-target="incidencias"><span>!</span><strong>Reportar incidencia</strong><small>Solicita atención</small></button>';
  } else {
    financePanelTitle.textContent='Recaudación y pendientes';
    financeAmount.textContent='S/ 84,620';
    financeCaption.textContent='Recaudado en septiembre';
    contextAction.textContent='+ Nuevo comunicado';
    contextAction.dataset.modal='comunicado';
    quickActions.innerHTML='<button data-view-target="pagos"><span>✓</span><strong>Validar pagos</strong><small>18 comprobantes pendientes</small></button><button data-view-target="estructura"><span>▦</span><strong>Gestionar unidades</strong><small>Edificios y residentes</small></button><button data-view-target="incidencias"><span>!</span><strong>Atender incidencias</strong><small>12 casos abiertos</small></button><button data-view-target="reportes"><span>▥</span><strong>Ver reportes</strong><small>Indicadores de gestión</small></button>';
  }
  bindViewTargets();
  showView('dashboard');
  showToast(`Vista cambiada a ${config.detail}.`);
}

function bindViewTargets(){
  document.querySelectorAll('[data-view-target]').forEach(btn=>{
    btn.onclick=()=>showView(btn.dataset.viewTarget);
  });
}

navItems.forEach(item=>item.addEventListener('click',()=>showView(item.dataset.view)));
bindViewTargets();
mobileMenu?.addEventListener('click',()=>sidebar.classList.toggle('open'));
roleSelect?.addEventListener('change',()=>applyRole(roleSelect.value));

document.addEventListener('click',e=>{
  if(window.innerWidth<=780 && sidebar.classList.contains('open')){
    if(!sidebar.contains(e.target)&&!mobileMenu?.contains(e.target)) sidebar.classList.remove('open');
  }
});

const forms={
  pago:{title:'Registrar pago',description:'Adjunta la evidencia y registra los datos de la operación. El pago quedará pendiente de validación.',html:`<label>Concepto<select><option>Mantenimiento septiembre</option><option>Fondo extraordinario</option><option>Reserva de área común</option></select></label><div class="form-row"><label>Monto<input value="320.00"></label><label>Fecha<input type="date" value="2026-09-17"></label></div><label>Medio de pago<select><option>Transferencia bancaria</option><option>Yape / Plin</option><option>Depósito</option></select></label><label>Número de operación<input placeholder="Ej. 45872196"></label><label>Comprobante<div class="upload-zone">Arrastra un archivo o haz clic para seleccionar</div></label><label>Observaciones<textarea placeholder="Comentario opcional"></textarea></label>`},
  reserva:{title:'Nueva reserva',description:'El sistema validará disponibilidad, horario, capacidad, anticipación y costo.',html:`<label>Área común<select><option>Sala Cowork</option><option>Sala SUM</option><option>Sala de niños</option></select></label><div class="form-row"><label>Fecha<input type="date" value="2026-09-20"></label><label>Horario<select><option>19:00 – 21:00</option><option>17:00 – 19:00</option></select></label></div><label>Número de asistentes<input type="number" value="4"></label><div class="inline-note">La disponibilidad y las reglas se validarán antes de confirmar. Algunas áreas requieren aprobación o pago.</div>`},
  visita:{title:'Autorizar visita',description:'Registra una visita única o recurrente asociada a tu unidad.',html:`<label>Nombre completo<input placeholder="Nombre del invitado"></label><label>Documento<input placeholder="DNI / CE / Pasaporte"></label><div class="form-row"><label>Tipo<select><option>Visita única</option><option>Recurrente</option></select></label><label>Fecha<input type="date" value="2026-09-18"></label></div><div class="form-row"><label>Desde<input type="time" value="18:00"></label><label>Hasta<input type="time" value="22:00"></label></div><label>Observaciones<textarea placeholder="Indicaciones para recepción"></textarea></label>`},
  incidencia:{title:'Nueva incidencia',description:'Registra categoría, prioridad, descripción y evidencia para iniciar el flujo de atención.',html:`<div class="form-row"><label>Categoría<select><option>Mantenimiento</option><option>Seguridad</option><option>Limpieza</option><option>Administración</option></select></label><label>Prioridad<select><option>Media</option><option>Alta</option><option>Baja</option></select></label></div><label>Descripción<textarea placeholder="Describe el problema"></textarea></label><label>Evidencia<div class="upload-zone">Adjuntar foto o documento</div></label>`},
  comunicado:{title:'Publicar comunicado',description:'Crea una comunicación segmentada según perfil o alcance.',html:`<label>Título<input placeholder="Título del comunicado"></label><label>Audiencia<select><option>Todo el condominio</option><option>Propietarios</option><option>Inquilinos</option><option>Torre A</option></select></label><label>Mensaje<textarea placeholder="Contenido"></textarea></label><div class="inline-note">En una versión productiva este evento podrá disparar notificaciones internas y canales externos configurados.</div>`}
};

function openModal(type='pago',space=''){
  const f=forms[type]||forms.pago;
  modalTitle.textContent=space ? `Reservar ${space}` : f.title;
  modalDescription.textContent=f.description;
  dynamicForm.innerHTML=f.html;
  if(space){const select=dynamicForm.querySelector('select');if(select) select.innerHTML=`<option>${space}</option>`;}
  modalBackdrop.hidden=false;
  document.body.style.overflow='hidden';
}
function closeModal(){modalBackdrop.hidden=true;document.body.style.overflow='';}
function showToast(message='Operación simulada correctamente.'){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2500);}

document.addEventListener('click',e=>{
  const modalTrigger=e.target.closest('[data-modal]');
  if(modalTrigger) openModal(modalTrigger.dataset.modal);
  const reserve=e.target.closest('.reserve-btn');
  if(reserve) openModal('reserva',reserve.dataset.space);
  const proto=e.target.closest('.prototype-action');
  if(proto) showToast('Acción disponible como parte del prototipo visual.');
  const approve=e.target.closest('.approve');
  const reject=e.target.closest('.reject');
  if(approve) showToast('Pago validado en la simulación.');
  if(reject) showToast('Pago observado en la simulación.');
});

contextAction?.addEventListener('click',()=>openModal(contextAction.dataset.modal||'pago'));
modalClose?.addEventListener('click',closeModal);
modalCancel?.addEventListener('click',closeModal);
modalBackdrop?.addEventListener('click',e=>{if(e.target===modalBackdrop) closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modalBackdrop.hidden) closeModal();});
modalForm?.addEventListener('submit',e=>{e.preventDefault();closeModal();showToast('Registro guardado en la simulación.');});

document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{button.parentElement.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));button.classList.add('active');showToast(`Filtro “${button.textContent.trim()}” aplicado.`);}));

applyRole('propietario');