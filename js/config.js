/**
 * Configuración de ZamProp Cloud (Supabase).
 *
 * Rellena estos valores con los de tu proyecto Supabase:
 *   Dashboard -> Project Settings -> API
 *     - Project URL  -> SUPABASE_URL
 *     - anon public  -> SUPABASE_ANON_KEY
 *
 * La clave "anon" es PÚBLICA por diseño: la seguridad real la
 * impone RLS en la base de datos, así que es seguro incluirla en
 * el cliente. NO pongas aquí la "service_role" key.
 */
window.ZAMPROP_CONFIG = {
  SUPABASE_URL: 'https://TU-PROYECTO.supabase.co',
  SUPABASE_ANON_KEY: 'TU_ANON_KEY'
};
