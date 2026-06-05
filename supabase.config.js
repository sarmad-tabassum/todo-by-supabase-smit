const supabaseUrl = "https://hnidlzruuoadphaaakgh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuaWRsenJ1dW9hZHBoYWFha2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzM3MzcsImV4cCI6MjA5NjA0OTczN30.SVe8F-g15TqSMt4qnh05Hm_bBiOzw2NMLU5CZfkjybM";

export const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
