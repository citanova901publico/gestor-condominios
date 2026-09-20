const loginScreen = document.getElementById('loginScreen');
const passwordLoginForm = document.getElementById('passwordLoginForm');
const tokenLoginForm = document.getElementById('tokenLoginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const requestTokenButton = document.getElementById('requestTokenButton');
const tokenPanel = document.getElementById('tokenPanel');
const temporaryToken = document.getElementById('temporaryToken');
const tokenDestination = document.getElementById('tokenDestination');
const backToPassword = document.getElementById('backToPassword');
const togglePassword = document.getElementById('togglePassword');
const DEMO_TEMPORARY_TOKEN = '482731';
let tokenRequestedAt = null;

function validateLoginEmail(){
  if(!loginEmail?.value || !loginEmail.checkValidity()){
    loginEmail?.focus();
    showToast('Ingresa un correo electrónico válido.');
    return false;
  }
  return true;
}

function completePrototypeLogin(method){
  document.body.classList.remove('auth-locked');
  document.body.classList.add('auth-authenticated');
  loginScreen?.classList.add('hidden');
  showToast(method === 'token' ? 'Token validado. Acceso concedido.' : 'Inicio de sesión correcto.');
}

passwordLoginForm?.addEventListener('submit',event=>{
  event.preventDefault();
  if(!validateLoginEmail()) return;
  if(!loginPassword.value.trim()){
    loginPassword.focus();
    showToast('Ingresa tu contraseña.');
    return;
  }
  completePrototypeLogin('password');
});

requestTokenButton?.addEventListener('click',()=>{
  if(!validateLoginEmail()) return;
  tokenRequestedAt=Date.now();
  tokenPanel?.classList.remove('hidden');
  passwordLoginForm?.classList.add('token-mode-muted');
  requestTokenButton.classList.add('hidden');
  if(tokenDestination) tokenDestination.textContent=`Enviamos un token temporal a ${loginEmail.value}.`;
  temporaryToken?.focus();
  showToast('Token temporal enviado al correo registrado.');
});

tokenLoginForm?.addEventListener('submit',event=>{
  event.preventDefault();
  if(!tokenRequestedAt){
    showToast('Solicita primero un token temporal.');
    return;
  }
  const elapsed=Date.now()-tokenRequestedAt;
  if(elapsed > 5*60*1000){
    tokenRequestedAt=null;
    temporaryToken.value='';
    showToast('El token temporal ha vencido. Solicita uno nuevo.');
    return;
  }
  if(temporaryToken.value.trim() !== DEMO_TEMPORARY_TOKEN){
    temporaryToken.focus();
    showToast('El token ingresado no es válido.');
    return;
  }
  tokenRequestedAt=null;
  temporaryToken.value='';
  completePrototypeLogin('token');
});

backToPassword?.addEventListener('click',()=>{
  tokenPanel?.classList.add('hidden');
  passwordLoginForm?.classList.remove('token-mode-muted');
  requestTokenButton?.classList.remove('hidden');
  temporaryToken.value='';
  tokenRequestedAt=null;
  loginPassword?.focus();
});

togglePassword?.addEventListener('click',()=>{
  const showing=loginPassword.type === 'text';
  loginPassword.type=showing ? 'password' : 'text';
  togglePassword.textContent=showing ? 'Ver' : 'Ocultar';
});

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
const contextSwitcher = document.getElementById('contextSwitcher');
const contextBuildingSelect = document.getElementById('contextBuildingSelect');
const contextUnitSelect = document.getElementById('contextUnitSelect');
const unitContextField = document.getElementById('unitContextField');

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

function configureSupervisorVisitFilter(role){
  const visitsSection=document.getElementById('visitas');
  const visitsTable=visitsSection?.querySelector('.visits-table');
  if(!visitsSection || !visitsTable) return;

  const visitRows=[...visitsTable.querySelectorAll('.data-row:not(.data-header)')];
  const sampleDepartments=['704','302','1105','204','806','1201'];

  visitRows.forEach((row,index)=>{
    if(!row.dataset.department) row.dataset.department=sampleDepartments[index%sampleDepartments.length];
    const firstCell=row.querySelector('span');
    if(firstCell && !firstCell.querySelector('.department-tag')){
      const tag=document.createElement('small');
      tag.className='department-tag';
      tag.textContent=`Dpto. ${row.dataset.department}`;
      firstCell.appendChild(tag);
    }
  });

  let filterBar=document.getElementById('supervisorVisitFilter');
  if(!filterBar){
    filterBar=document.createElement('div');
    filterBar.id='supervisorVisitFilter';
    filterBar.className='supervisor-visit-filter hidden';
    filterBar.innerHTML=`
      <div>
        <span class="eyebrow">Filtro de supervisión</span>
        <strong>Visitas autorizadas por departamento</strong>
        <small>Consulta únicamente las autorizaciones de una unidad dentro de tu ámbito.</small>
      </div>
      <label>
        Departamento
        <select id="departmentVisitFilter">
          <option value="all">Todos los departamentos</option>
        </select>
      </label>`;
    visitsTable.parentElement.insertBefore(filterBar,visitsTable);
  }

  const select=document.getElementById('departmentVisitFilter');
  const departments=[...new Set(visitRows.map(row=>row.dataset.department))].sort((a,b)=>Number(a)-Number(b));
  if(select && select.options.length===1){
    departments.forEach(department=>{
      const option=document.createElement('option');
      option.value=department;
      option.textContent=`Dpto. ${department}`;
      select.appendChild(option);
    });
  }

  const isSupervisor=role==='supervisor';
  filterBar.classList.toggle('hidden',!isSupervisor);

  if(!isSupervisor){
    if(select) select.value='all';
    visitRows.forEach(row=>row.style.display='');
    return;
  }

  if(select && !select.dataset.bound){
    select.addEventListener('change',()=>{
      const selected=select.value;
      visitRows.forEach(row=>{
        row.style.display=selected==='all'||row.dataset.department===selected ? '' : 'none';
      });
      const label=selected==='all'?'Todos los departamentos':`Dpto. ${selected}`;
      showToast(`Filtro de visitas: ${label}.`);
    });
    select.dataset.bound='true';
  }
}

const contextScopes = {
  propietario:{
    buildings:[
      {id:'torre-a',name:'Torre A',units:[
        {id:'704',name:'Dpto. 704',balance:'S/ 385.00',reservation:'Sala Cowork',reservationDate:'20 sep · 7:00 p. m.'},
        {id:'1202',name:'Dpto. 1202',balance:'S/ 0.00',reservation:'Sin reservas',reservationDate:'Sin próximas reservas'}
      ]},
      {id:'torre-b',name:'Torre B',units:[
        {id:'305',name:'Dpto. 305',balance:'S/ 710.00',reservation:'Sala SUM',reservationDate:'27 sep · 6:00 p. m.'}
      ]}
    ]
  },
  supervisor:{
    buildings:[
      {id:'torre-a',name:'Torre A',collection:'S/ 42,180',payments:'8',incidents:'5',reservations:'19'},
      {id:'torre-b',name:'Torre B',collection:'S/ 31,640',payments:'6',incidents:'4',reservations:'14'},
      {id:'torre-c',name:'Torre C',collection:'S/ 10,800',payments:'4',incidents:'3',reservations:'8'}
    ]
  }
};

function fillSelect(select,items){
  if(!select) return;
  select.innerHTML='';
  items.forEach(item=>{
    const option=document.createElement('option');
    option.value=item.id;
    option.textContent=item.name;
    select.appendChild(option);
  });
}

function updateContextDisplay(role){
  if(role==='propietario'){
    const scope=contextScopes.propietario;
    const building=scope.buildings.find(x=>x.id===contextBuildingSelect.value) || scope.buildings[0];
    const unit=building.units.find(x=>x.id===contextUnitSelect.value) || building.units[0];
    profileRole.textContent=`Propietario · ${building.name} · ${unit.name}`;
    contextLabel.textContent=`Mi residencia · ${building.name}`;
    const eyebrow=residentWelcome?.querySelector('.eyebrow');
    if(eyebrow) eyebrow.textContent=`Resumen de ${unit.name} · ${building.name}`;
    const cards=residentStats?.querySelectorAll('.stat-card');
    if(cards?.[0]){
      const strong=cards[0].querySelector('strong');
      const small=cards[0].querySelector('small');
      if(strong) strong.textContent=unit.balance;
      if(small) small.textContent=unit.balance==='S/ 0.00'?'Sin deuda pendiente':'Vence el 25 de septiembre';
    }
    if(cards?.[1]){
      const strong=cards[1].querySelector('strong');
      const small=cards[1].querySelector('small');
      if(strong) strong.textContent=unit.reservation;
      if(small) small.textContent=unit.reservationDate;
    }
    financeAmount.textContent=unit.balance==='S/ 0.00'?'S/ 1,805.00':'S/ 1,420.00';
  } else if(role==='supervisor'){
    const scope=contextScopes.supervisor;
    const building=scope.buildings.find(x=>x.id===contextBuildingSelect.value) || scope.buildings[0];
    profileRole.textContent=`Supervisor · ${building.name}`;
    contextLabel.textContent=`Supervisión · ${building.name}`;
    const title=adminWelcome?.querySelector('h2');
    const copy=adminWelcome?.querySelector('p');
    if(title) title.textContent=`Residencial Central · ${building.name}`;
    if(copy) copy.textContent=`Seguimiento de cobranza, reservas, incidencias y validaciones del ámbito seleccionado: ${building.name}.`;
    const cards=adminStats?.querySelectorAll('.stat-card');
    if(cards?.[0]?.querySelector('strong')) cards[0].querySelector('strong').textContent=building.collection;
    if(cards?.[1]?.querySelector('strong')) cards[1].querySelector('strong').textContent=building.payments;
    if(cards?.[2]?.querySelector('strong')) cards[2].querySelector('strong').textContent=building.incidents;
    if(cards?.[3]?.querySelector('strong')) cards[3].querySelector('strong').textContent=building.reservations;
    financeAmount.textContent=building.collection;
  }
}

function configureContextSelector(role){
  const supportsContext=role==='propietario'||role==='supervisor';
  contextSwitcher?.classList.toggle('hidden',!supportsContext);
  if(!supportsContext) return;

  const scope=contextScopes[role];
  fillSelect(contextBuildingSelect,scope.buildings);
  unitContextField?.classList.toggle('hidden',role!=='propietario');

  if(role==='propietario'){
    const building=scope.buildings[0];
    fillSelect(contextUnitSelect,building.units);
  }
  updateContextDisplay(role);
}

contextBuildingSelect?.addEventListener('change',()=>{
  const role=roleSelect.value;
  if(role==='propietario'){
    const building=contextScopes.propietario.buildings.find(x=>x.id===contextBuildingSelect.value);
    fillSelect(contextUnitSelect,building?.units||[]);
  }
  updateContextDisplay(role);
  showToast('Contexto de información actualizado.');
});

contextUnitSelect?.addEventListener('change',()=>{
  updateContextDisplay(roleSelect.value);
  showToast('Departamento seleccionado actualizado.');
});

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
  document.querySelectorAll('.admin-receipt-action').forEach(button=>button.classList.toggle('hidden',role!=='administrador'));

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
  configureSupervisorVisitFilter(role);
  configureContextSelector(role);
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

let activeModalType = null;

const forms={
  pago:{title:'Registrar pago',description:'Adjunta la evidencia y registra los datos de la operación. El pago quedará pendiente de validación.',html:`<label>Concepto<select><option>Mantenimiento septiembre</option><option>Fondo extraordinario</option><option>Reserva de área común</option></select></label><div class="form-row"><label>Monto<input value="320.00"></label><label>Fecha<input type="date" value="2026-09-17"></label></div><label>Medio de pago<select><option>Transferencia bancaria</option><option>Yape / Plin</option><option>Depósito</option></select></label><label>Número de operación<input placeholder="Ej. 45872196"></label><label>Comprobante<div class="upload-zone">Arrastra un archivo o haz clic para seleccionar</div></label><label>Observaciones<textarea placeholder="Comentario opcional"></textarea></label>`},
  reserva:{title:'Nueva reserva',description:'El sistema validará disponibilidad, horario, capacidad, anticipación y costo.',html:`<label>Área común<select><option>Sala Cowork</option><option>Sala SUM</option><option>Sala de niños</option></select></label><div class="form-row"><label>Fecha<input type="date" value="2026-09-20"></label><label>Horario<select><option>19:00 – 21:00</option><option>17:00 – 19:00</option></select></label></div><label>Número de asistentes<input type="number" value="4"></label><div class="inline-note">La disponibilidad y las reglas se validarán antes de confirmar. Algunas áreas requieren aprobación o pago.</div>`},
  visita:{title:'Autorizar visita',description:'Registra una visita única o recurrente asociada a tu unidad.',html:`<label>Nombre completo<input placeholder="Nombre del invitado"></label><label>Documento<input placeholder="DNI / CE / Pasaporte"></label><div class="form-row"><label>Tipo<select><option>Visita única</option><option>Recurrente</option></select></label><label>Fecha<input type="date" value="2026-09-18"></label></div><div class="form-row"><label>Desde<input type="time" value="18:00"></label><label>Hasta<input type="time" value="22:00"></label></div><label>Observaciones<textarea placeholder="Indicaciones para recepción"></textarea></label>`},
  incidencia:{title:'Nueva incidencia',description:'Registra categoría, prioridad, descripción y evidencia para iniciar el flujo de atención.',html:`<div class="form-row"><label>Categoría<select><option>Mantenimiento</option><option>Seguridad</option><option>Limpieza</option><option>Administración</option></select></label><label>Prioridad<select><option>Media</option><option>Alta</option><option>Baja</option></select></label></div><label>Descripción<textarea placeholder="Describe el problema"></textarea></label><label>Evidencia<div class="upload-zone">Adjuntar foto o documento</div></label>`},
  comunicado:{title:'Publicar comunicado',description:'Crea una comunicación segmentada según perfil o alcance.',html:`<label>Título<input placeholder="Título del comunicado"></label><label>Audiencia<select><option>Todo el condominio</option><option>Propietarios</option><option>Inquilinos</option><option>Torre A</option></select></label><label>Mensaje<textarea placeholder="Contenido"></textarea></label><div class="inline-note">En una versión productiva este evento podrá disparar notificaciones internas y canales externos configurados.</div>`},
  concepto:{title:'Nuevo concepto de gasto',description:'Configura la periodicidad, distribución y estado de este concepto sin afectar las reglas de otros gastos.',html:`<label>Nombre del concepto<input placeholder="Ej. Cuota extraordinaria para cámaras"></label><div class="form-row"><label>Periodicidad<select id="conceptFrequency"><option value="recurrente">Pago recurrente</option><option value="unico">Pago único</option><option value="fraccionado">Pago fraccionado en N cuotas</option></select></label><label>Regla de distribución<select><option>Por unidad en partes iguales</option><option>Proporcional por metros cuadrados</option></select></label></div><div class="form-row concept-installments hidden" id="conceptInstallments"><label>Número total de cuotas<input type="number" min="2" value="6"></label><label>Cuota vigente<input type="number" min="1" value="3"></label></div><div class="form-row"><label>Importe total del concepto<input type="number" step="0.01" placeholder="0.00"></label><label>Estado<select><option>Activo</option><option>Inactivo</option></select></label></div><label>Periodo de inicio<input type="month" value="2026-09"></label><div class="inline-note">Solo los conceptos activos participan en nuevas generaciones de cargos. Los inactivos conservan el histórico.</div>`},
  recibos:{title:'Generar documentos de recibo',description:'Revisa el período y los conceptos activos antes de generar un documento individual por unidad.',html:`<div class="form-row"><label>Edificio<select><option>Residencial Central - Torre A</option><option>Residencial Central - Torre B</option><option>Residencial Central - Torre C</option></select></label><label>Periodo<input type="month" value="2026-09"></label></div><label>Fecha de vencimiento<input type="date" value="2026-09-25"></label><div class="receipt-review"><div><span>Conceptos activos</span><strong>7</strong></div><div><span>Unidades a procesar</span><strong>48</strong></div><div><span>Documentos a generar</span><strong>48 recibos</strong></div></div><div class="receipt-concepts"><strong>Conceptos incluidos</strong><span>Administración / portería y limpieza</span><span>Fondo de contingencia</span><span>Cuota extraordinaria para cámaras · cuota 3 de 6</span><span>Mantenimientos y servicios aplicables</span></div><div class="inline-note">La generación utilizará solo conceptos activos, respetando periodicidad, cuotas vigentes y regla de distribución de cada concepto. En el producto final quedará trazabilidad del usuario, fecha y período generado.</div>`}
};

function openModal(type='pago',space=''){
  const f=forms[type]||forms.pago;
  activeModalType=type;
  modalTitle.textContent=space ? `Reservar ${space}` : f.title;
  modalDescription.textContent=f.description;
  dynamicForm.innerHTML=f.html;

  if(type==='reserva' && roleSelect?.value==='propietario'){
    dynamicForm.insertAdjacentHTML('beforeend',`
      <section class="guest-list-options">
        <div class="guest-list-heading">
          <div>
            <span class="eyebrow">Opcional</span>
            <strong>Lista de invitados</strong>
            <small>Puedes agregarla ahora o completar esta información posteriormente desde el detalle de la reserva.</small>
          </div>
          <span class="badge neutral">No obligatorio</span>
        </div>
        <div class="guest-entry-tabs" role="group" aria-label="Forma de registrar invitados">
          <button type="button" class="guest-entry-tab active" data-guest-mode="manual">Ingresar lista</button>
          <button type="button" class="guest-entry-tab" data-guest-mode="file">Adjuntar documento</button>
        </div>
        <div class="guest-entry-panel" data-guest-panel="manual">
          <label>Invitados
            <textarea id="reservationGuestList" placeholder="Ej. Andrea Torres - DNI 12345678&#10;José Ramírez - DNI 87654321"></textarea>
          </label>
          <small class="field-help">Un invitado por línea. En la versión productiva podrá validarse y estructurarse esta información.</small>
        </div>
        <div class="guest-entry-panel hidden" data-guest-panel="file">
          <label>Documento con lista de invitados
            <input id="reservationGuestFile" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt">
          </label>
          <small class="field-help">Formatos de ejemplo: PDF, Word, Excel, CSV o texto. El archivo puede adjuntarse también después de crear la reserva.</small>
        </div>
      </section>`);
  }

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
  const guestTab=e.target.closest('.guest-entry-tab');
  const frequency=e.target.closest('#conceptFrequency');
  const conceptToggle=e.target.closest('.concept-toggle');
  if(approve) showToast('Pago validado en la simulación.');
  if(reject) showToast('Pago observado en la simulación.');
  if(guestTab){
    const mode=guestTab.dataset.guestMode;
    document.querySelectorAll('.guest-entry-tab').forEach(tab=>tab.classList.toggle('active',tab===guestTab));
    document.querySelectorAll('[data-guest-panel]').forEach(panel=>panel.classList.toggle('hidden',panel.dataset.guestPanel!==mode));
  }
  if(frequency){
    document.getElementById('conceptInstallments')?.classList.toggle('hidden',frequency.value!=='fraccionado');
  }
  if(conceptToggle){
    const row=conceptToggle.closest('.data-row');
    const badge=row?.querySelector('.concept-status');
    const becomingInactive=conceptToggle.dataset.state==='active';
    conceptToggle.dataset.state=becomingInactive?'inactive':'active';
    conceptToggle.textContent=becomingInactive?'Activar':'Inactivar';
    if(badge){
      badge.textContent=becomingInactive?'Inactivo':'Activo';
      badge.classList.toggle('success',!becomingInactive);
      badge.classList.toggle('neutral',becomingInactive);
    }
    showToast(becomingInactive?'Concepto inactivado. No generará nuevos cargos.':'Concepto activado para futuras generaciones.');
  }
});

contextAction?.addEventListener('click',()=>openModal(contextAction.dataset.modal||'pago'));
modalClose?.addEventListener('click',closeModal);
modalCancel?.addEventListener('click',closeModal);
modalBackdrop?.addEventListener('click',e=>{if(e.target===modalBackdrop) closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modalBackdrop.hidden) closeModal();});
modalForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const reservationForOwner=activeModalType==='reserva' && roleSelect?.value==='propietario';
  const receiptGeneration=activeModalType==='recibos' && roleSelect?.value==='administrador';
  closeModal();
  if(reservationForOwner){
    showToast('Reserva registrada. La lista de invitados puede completarse ahora o posteriormente.');
  } else if(receiptGeneration){
    showToast('48 documentos de recibo generados para el período seleccionado.');
  } else {
    showToast('Registro guardado en la simulación.');
  }
  activeModalType=null;
});

document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{button.parentElement.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));button.classList.add('active');showToast(`Filtro “${button.textContent.trim()}” aplicado.`);}));

applyRole('propietario');