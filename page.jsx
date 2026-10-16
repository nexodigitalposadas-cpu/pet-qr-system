'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PetProfile() {
  const params = useParams();
  const id = params?.id;
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchPet() {
      try {
        const { data, error } = await supabase
          .from('mascotas')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error al buscar la mascota:', error);
        } else {
          setPet(data);
        }
      } catch (err) {
        console.error('Error de conexión:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPet();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Cargando tarjeta de la mascota...</div>;
  }

  if (!pet) {
    return <div className="p-8 text-center text-red-500">No se encontró ninguna mascota con este ID.</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full text-center">
        {pet.image_url && (
          <img 
            src={pet.image_url} 
            alt={pet.name} 
            className="w-32 h-32 object-cover rounded-full mx-auto mb-4 shadow-md"
          />
        )}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{pet.name}</h1>
        {pet.breed && <p className="text-gray-600 mb-4">Raza: {pet.breed}</p>}
        
        {pet.observations && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 text-left text-sm text-yellow-700">
            <strong>Observaciones:</strong> {pet.observations}
          </div>
        )}

        {pet.owner_phone && (
          <a
            href={`https://wa.me/${pet.owner_phone}?text=¡Hola! Encontré a ${pet.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl shadow transition"
          >
            Contactar al Dueño 📞
          </a>
        )}
      </div>
    </main>
  );
}
