// Mapa único: todas as rotas usam o MESMO nome de pasta.
// GitHub diferencia maiúsculas/minúsculas: confira se bate com o repo.
// Para aparecer um novo candidato na home, basta adicionar uma entrada aqui.
export const mapaCandidatos: Record<string, any> = {
  '1': { id: 1, nome: 'Flávio Bolsonaro', partido: 'PL', cargo: 'PRESIDENTE', ano: 2026,
         estado: 'RJ', cidade: 'Resende',
         pasta: 'FlavioBolsonaro',
         linkFoto: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Fl%C3%A1vio_Bolsonaro_01.09.26.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original',
         indiceDeCoerencia: 85.5 },
  '2': { id: 2, nome: 'Lula', partido: 'PT', cargo: 'PRESIDENTE', ano: 2026,
         estado: 'PE', cidade: 'Caetés',
         pasta: 'Lula', linkFoto: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/09.07.2026_-_Presidente_Lula.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original', indiceDeCoerencia: 80.0 },
  '3': { id: 3, nome: 'Renan Santos', partido: 'MISSÃO', cargo: 'PRESIDENTE', ano: 2026,
         estado: 'SP', cidade: 'São Paulo',
         pasta: 'RenanSantos', linkFoto: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/2026-01-11_Renan_Santos_%2855036684938%29_%283x4%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original', indiceDeCoerencia: 88.0 },
};

export const getCandidato = (id: string) => mapaCandidatos[id] || mapaCandidatos['1'];