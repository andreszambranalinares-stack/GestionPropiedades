/**
 * ZamProp Cloud — cliente Supabase (Fase 1).
 *
 * Módulo ES que crea el cliente y expone una API de Auth, Grupos y
 * Datos lista para que la Fase 2 conecte la interfaz. Se carga como
 * <script type="module"> y publica `window.ZampCloud` para poder
 * usarlo desde el código clásico (App / UI / Store).
 *
 * Requiere que js/config.js esté cargado antes (define ZAMPROP_CONFIG).
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cfg = window.ZAMPROP_CONFIG || {};
export const supabase = createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

/* ----------------------------- Auth ----------------------------- */
export const Auth = {
  async signUp(email, password, nombre) {
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } }
    });
  },
  signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
  },
  signOut() {
    return supabase.auth.signOut();
  },
  async currentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },
  onAuthChange(cb) {
    return supabase.auth.onAuthStateChange((_event, session) => cb(session));
  }
};

/* ---------------------------- Grupos ---------------------------- */
export const Groups = {
  /** Grupos a los que pertenezco, con mi rol en cada uno. */
  async mine() {
    const { data, error } = await supabase
      .from('group_members')
      .select('rol, groups(*)');
    if (error) throw error;
    return (data || []).map(r => ({ ...r.groups, rol: r.rol }));
  },

  /** Crear un grupo (el dueño entra como admin vía trigger). */
  async create(nombre) {
    const user = await Auth.currentUser();
    const { data, error } = await supabase
      .from('groups')
      .insert({ nombre, owner_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /** Miembros de un grupo (nombre, email, rol). */
  async members(groupId) {
    const { data, error } = await supabase
      .from('group_members')
      .select('rol, user_id, profiles(id, nombre, email)')
      .eq('group_id', groupId);
    if (error) throw error;
    return data || [];
  },

  /** Invitar a alguien por email con un rol. */
  async invite(groupId, email, rol = 'visualizador') {
    const user = await Auth.currentUser();
    const { error } = await supabase.from('group_invites').insert({
      group_id: groupId, email: email.toLowerCase(), rol, invited_by: user.id
    });
    if (error) throw error;
  },

  /** Invitaciones pendientes dirigidas a mi email. */
  async pendingInvites() {
    const user = await Auth.currentUser();
    const { data, error } = await supabase
      .from('group_invites')
      .select('id, rol, created_at, groups(nombre)')
      .eq('email', (user.email || '').toLowerCase())
      .is('accepted_at', null);
    if (error) throw error;
    return data || [];
  },

  /** Aceptar una invitación (valida email en el servidor vía RPC). */
  async acceptInvite(inviteId) {
    const { error } = await supabase.rpc('accept_invite', { invite_id: inviteId });
    if (error) throw error;
  },

  /** Cambiar el rol de un miembro (solo admin). */
  async setRole(groupId, userId, rol) {
    const { error } = await supabase
      .from('group_members')
      .update({ rol })
      .eq('group_id', groupId)
      .eq('user_id', userId);
    if (error) throw error;
  },

  /** Quitar a un miembro del grupo. */
  async removeMember(groupId, userId) {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);
    if (error) throw error;
  }
};

/* ----------------------------- Datos ---------------------------- */
/**
 * Capa de datos por grupo. La Fase 2 sustituirá las llamadas a
 * localStorage de Store.js por estas. Todas filtran por RLS según
 * el grupo del usuario, así que basta con pasar el groupId.
 */
export const Data = {
  /** Edificios del grupo con sus apartamentos e inquilino activo. */
  async buildings(groupId) {
    const { data, error } = await supabase
      .from('buildings')
      .select('*, apartments(*, tenants(*))')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  /** Directorio de inquilinos ACTIVOS del grupo (clientes activos). */
  async activeTenants(groupId) {
    const { data, error } = await supabase
      .from('tenants')
      .select('*, apartments(numero, buildings(nombre, group_id))')
      .eq('activo', true);
    if (error) throw error;
    return (data || []).filter(t => t.apartments?.buildings?.group_id === groupId);
  },

  /** Histórico de ex-inquilinos del grupo. */
  async pastTenants(groupId) {
    const { data, error } = await supabase
      .from('tenants')
      .select('*, apartments(numero, buildings(nombre, group_id))')
      .eq('activo', false);
    if (error) throw error;
    return (data || []).filter(t => t.apartments?.buildings?.group_id === groupId);
  }
};

// Exponer al ámbito global para el código clásico (App/UI/Store)
window.ZampCloud = { supabase, Auth, Groups, Data };
