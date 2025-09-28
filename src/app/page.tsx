// app/page.tsx

import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1>¡Home Funcional!</h1>
      <p style={{ margin: '20px 0' }}>
        El problema de ruteo ha desaparecido.
      </p>
      
      <Link 
        href="/catalogo" 
        style={{ color: '#0070f3', textDecoration: 'underline' }}
      >
        Ir al Catálogo
      </Link>
      
      <p style={{ marginTop: '30px', color: '#666' }}>
        El Navbar de arriba debe funcionar ahora para ir a /admin.
      </p>
    </main>
  );
}