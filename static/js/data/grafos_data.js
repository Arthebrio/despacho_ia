/* ============================================
   GRAFOS_DATA.JS - DATOS DE LA LEY DE AMPARO
   Versión final con texto_esfera para burbujas 3D
   Generado: 2026-05-30
   ============================================
   
   ESTRUCTURA DE CADA NODO:
   {
     "id": 1,
     "centro_label": "Demanda de Amparo",   // Para UI y búsquedas
     "texto_esfera": "Demanda Amp",         // Para DENTRO de la burbuja 3D
     "capa": "Alta",                        // Para órbita (Alta/Media/Baja)
     "peso": 10,                            // Para tamaño de la esfera
     "satelites": [ { "id": 2 }, ... ]      // Solo IDs de relaciones
   }
   
   USO EN EL VISUALIZADOR:
   - El nodo CENTRO usa su propio "texto_esfera"
   - Cada SATÉLITE obtiene su "texto_esfera", "capa" y "peso" del nodo referenciado
   - "centro_label" se usa SOLO para la UI (títulos, búsquedas)
*/

const GRAFOS_DATA = [
  {
    "id": 1,
    "centro_label": "Demanda de Amparo",
    "texto_esfera": "Demanda Amp",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 2 },
      { "id": 3 },
      { "id": 4 },
      { "id": 18 },
      { "id": 9 },
      { "id": 10 },
      { "id": 13 },
      { "id": 129 },
      { "id": 14 },
      { "id": 15 }
    ]
  },
  {
    "id": 2,
    "centro_label": "Prevención",
    "texto_esfera": "Prevención",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 1 },
      { "id": 4 },
      { "id": 3 },
      { "id": 18 },
      { "id": 129 },
      { "id": 16 },
      { "id": 89 },
      { "id": 40 },
      { "id": 17 },
      { "id": 104 }
    ]
  },
  {
    "id": 3,
    "centro_label": "Desechamiento",
    "texto_esfera": "Desechamiento",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 12 },
      { "id": 1 },
      { "id": 2 },
      { "id": 19 },
      { "id": 125 },
      { "id": 11 },
      { "id": 129 },
      { "id": 59 },
      { "id": 40 },
      { "id": 38 }
    ]
  },
  {
    "id": 4,
    "centro_label": "Admisión",
    "texto_esfera": "Admisión",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 1 },
      { "id": 2 },
      { "id": 5 },
      { "id": 6 },
      { "id": 104 },
      { "id": 74 },
      { "id": 20 },
      { "id": 129 },
      { "id": 18 },
      { "id": 38 }
    ]
  },
  {
    "id": 5,
    "centro_label": "Informe Justificado",
    "texto_esfera": "Inf Justif",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 73 },
      { "id": 4 },
      { "id": 6 },
      { "id": 129 },
      { "id": 21 },
      { "id": 22 },
      { "id": 23 },
      { "id": 24 },
      { "id": 161 },
      { "id": 74 }
    ]
  },
  {
    "id": 6,
    "centro_label": "Audiencia Constitucional",
    "texto_esfera": "Aud Const",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 4 },
      { "id": 5 },
      { "id": 25 },
      { "id": 7 },
      { "id": 8 },
      { "id": 129 },
      { "id": 26 },
      { "id": 13 },
      { "id": 27 },
      { "id": 52 }
    ]
  },
  {
    "id": 7,
    "centro_label": "Alegatos",
    "texto_esfera": "Alegatos",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 6 },
      { "id": 8 },
      { "id": 10 },
      { "id": 25 },
      { "id": 129 },
      { "id": 40 },
      { "id": 35 },
      { "id": 143 },
      { "id": 72 }
    ]
  },
  {
    "id": 8,
    "centro_label": "Sentencia",
    "texto_esfera": "Sentencia",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 6 },
      { "id": 7 },
      { "id": 28 },
      { "id": 29 },
      { "id": 11 },
      { "id": 132 },
      { "id": 60 },
      { "id": 124 },
      { "id": 10 },
      { "id": 145 }
    ]
  },
  {
    "id": 9,
    "centro_label": "Amparo Indirecto",
    "texto_esfera": "Amp Indirec",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 1 },
      { "id": 6 },
      { "id": 10 },
      { "id": 39 },
      { "id": 104 },
      { "id": 25 },
      { "id": 30 },
      { "id": 124 },
      { "id": 125 },
      { "id": 31 }
    ]
  },
  {
    "id": 10,
    "centro_label": "Amparo Directo",
    "texto_esfera": "Amp Directo",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 1 },
      { "id": 32 },
      { "id": 9 },
      { "id": 39 },
      { "id": 136 },
      { "id": 34 },
      { "id": 33 },
      { "id": 124 },
      { "id": 125 },
      { "id": 35 }
    ]
  },
  {
    "id": 11,
    "centro_label": "Sobreseimiento",
    "texto_esfera": "Sobreseimien",
    "capa": "Media",
    "peso": 6,
    "satelites": [
      { "id": 12 },
      { "id": 92 },
      { "id": 8 },
      { "id": 94 },
      { "id": 36 },
      { "id": 93 },
      { "id": 95 },
      { "id": 124 },
      { "id": 96 },
      { "id": 123 }
    ]
  },
  {
    "id": 12,
    "centro_label": "Improcedencia",
    "texto_esfera": "Improcedencia",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 11 },
      { "id": 3 },
      { "id": 78 },
      { "id": 136 },
      { "id": 37 },
      { "id": 129 },
      { "id": 30 },
      { "id": 29 },
      { "id": 21 }
    ]
  },
  {
    "id": 13,
    "centro_label": "Comparecencia",
    "texto_esfera": "Comparecencia",
    "capa": "Media",
    "peso": 6,
    "satelites": [
      { "id": 1 },
      { "id": 6 },
      { "id": 14 },
      { "id": 4 },
      { "id": 89 },
      { "id": 40 },
      { "id": 85 },
      { "id": 86 }
    ]
  },
  {
    "id": 14,
    "centro_label": "Medios Electrónicos",
    "texto_esfera": "Medios Electron",
    "capa": "Baja",
    "peso": 4,
    "satelites": [
      { "id": 1 },
      { "id": 40 },
      { "id": 103 },
      { "id": 13 },
      { "id": 15 },
      { "id": 129 },
      { "id": 69 },
      { "id": 70 },
      { "id": 71 },
      { "id": 41 }
    ]
  },
  {
    "id": 15,
    "centro_label": "Copias",
    "texto_esfera": "Copias",
    "capa": "Baja",
    "peso": 4,
    "satelites": [
      { "id": 1 },
      { "id": 14 },
      { "id": 40 },
      { "id": 104 },
      { "id": 23 },
      { "id": 74 },
      { "id": 10 },
      { "id": 124 },
      { "id": 125 },
      { "id": 2 }
    ]
  },
  {
    "id": 16,
    "centro_label": "Irregularidades",
    "texto_esfera": "Irregularid",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 2 },
      { "id": 1 },
      { "id": 18 },
      { "id": 129 },
      { "id": 89 },
      { "id": 3 },
      { "id": 17 },
      { "id": 40 },
      { "id": 59 }
    ]
  },
  {
    "id": 17,
    "centro_label": "Auto de Prevención",
    "texto_esfera": "Auto Prevención",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 2 },
      { "id": 1 },
      { "id": 129 },
      { "id": 16 },
      { "id": 40 },
      { "id": 89 },
      { "id": 4 },
      { "id": 3 },
      { "id": 18 },
      { "id": 104 }
    ]
  },
  {
    "id": 18,
    "centro_label": "Requisitos de Demanda",
    "texto_esfera": "Requisitos",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 1 },
      { "id": 2 },
      { "id": 4 },
      { "id": 3 },
      { "id": 24 },
      { "id": 73 },
      { "id": 30 },
      { "id": 13 },
      { "id": 15 },
      { "id": 40 }
    ]
  },
  {
    "id": 19,
    "centro_label": "Causa Manifiesta",
    "texto_esfera": "Causa Manifiesta",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 3 },
      { "id": 12 },
      { "id": 1 },
      { "id": 129 },
      { "id": 89 },
      { "id": 125 },
      { "id": 59 },
      { "id": 40 },
      { "id": 21 }
    ]
  },
  {
    "id": 20,
    "centro_label": "Auto de Admisión",
    "texto_esfera": "Auto Admisorio",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 4 },
      { "id": 1 },
      { "id": 5 },
      { "id": 6 },
      { "id": 104 },
      { "id": 74 },
      { "id": 2 },
      { "id": 40 },
      { "id": 129 },
      { "id": 38 }
    ]
  },
  {
    "id": 21,
    "centro_label": "Falta de Informe",
    "texto_esfera": "Falta Informe",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 5 },
      { "id": 24 },
      { "id": 149 },
      { "id": 129 },
      { "id": 106 },
      { "id": 25 },
      { "id": 161 },
      { "id": 73 }
    ]
  },
  {
    "id": 22,
    "centro_label": "Fundamentación",
    "texto_esfera": "Fundamentación",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 5 },
      { "id": 24 },
      { "id": 8 },
      { "id": 73 },
      { "id": 1 },
      { "id": 35 },
      { "id": 51 }
    ]
  },
  {
    "id": 23,
    "centro_label": "Copia Certificada",
    "texto_esfera": "Copia Certif",
    "capa": "Media",
    "peso": 6,
    "satelites": [
      { "id": 5 },
      { "id": 15 },
      { "id": 73 },
      { "id": 40 },
      { "id": 129 },
      { "id": 50 },
      { "id": 14 },
      { "id": 1 }
    ]
  },
  {
    "id": 24,
    "centro_label": "Acto Reclamado",
    "texto_esfera": "Acto Reclamado",
    "capa": "Baja",
    "peso": 6,
    "satelites": [
      { "id": 73 },
      { "id": 72 },
      { "id": 1 },
      { "id": 104 },
      { "id": 5 },
      { "id": 8 },
      { "id": 12 },
      { "id": 37 },
      { "id": 156 }
    ]
  },
  {
    "id": 25,
    "centro_label": "Pruebas",
    "texto_esfera": "Pruebas",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 6 },
      { "id": 53 },
      { "id": 54 },
      { "id": 15 },
      { "id": 55 },
      { "id": 7 },
      { "id": 57 },
      { "id": 58 }
    ]
  },
  {
    "id": 26,
    "centro_label": "Publicidad",
    "texto_esfera": "Publicidad",
    "capa": "Media",
    "peso": 6,
    "satelites": [
      { "id": 6 },
      { "id": 172 },
      { "id": 40 },
      { "id": 165 },
      { "id": 14 },
      { "id": 109 }
    ]
  },
  {
    "id": 27,
    "centro_label": "Diferimiento",
    "texto_esfera": "Diferimiento",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 6 },
      { "id": 25 },
      { "id": 129 },
      { "id": 40 },
      { "id": 104 },
      { "id": 7 },
      { "id": 8 },
      { "id": 53 }
    ]
  },
  {
    "id": 28,
    "centro_label": "Concesión del Amparo",
    "texto_esfera": "Concesión",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 8 },
      { "id": 145 },
      { "id": 29 },
      { "id": 60 },
      { "id": 124 },
      { "id": 11 },
      { "id": 157 }
    ]
  },
  {
    "id": 29,
    "centro_label": "Negación del Amparo",
    "texto_esfera": "Negación",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 8 },
      { "id": 28 },
      { "id": 11 },
      { "id": 12 },
      { "id": 59 },
      { "id": 124 },
      { "id": 123 }
    ]
  },
  {
    "id": 30,
    "centro_label": "Normas Generales",
    "texto_esfera": "Normas Grals",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 9 },
      { "id": 170 },
      { "id": 28 },
      { "id": 165 },
      { "id": 129 },
      { "id": 12 },
      { "id": 35 }
    ]
  },
  {
    "id": 31,
    "centro_label": "Actos Fuera de Juicio",
    "texto_esfera": "Act Fuera Juic",
    "capa": "Baja",
    "peso": 7,
    "satelites": [
      { "id": 9 },
      { "id": 73 },
      { "id": 148 },
      { "id": 24 },
      { "id": 104 },
      { "id": 12 },
      { "id": 129 },
      { "id": 37 }
    ]
  },
  {
    "id": 32,
    "centro_label": "Sentencias Definitivas",
    "texto_esfera": "Sentenc Defin",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 10 },
      { "id": 8 },
      { "id": 33 },
      { "id": 136 },
      { "id": 34 },
      { "id": 60 },
      { "id": 145 },
      { "id": 123 },
      { "id": 124 }
    ]
  },
  {
    "id": 33,
    "centro_label": "Laudos",
    "texto_esfera": "Laudos",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 10 },
      { "id": 32 },
      { "id": 104 },
      { "id": 148 },
      { "id": 136 },
      { "id": 47 },
      { "id": 35 },
      { "id": 145 },
      { "id": 124 }
    ]
  },
  {
    "id": 34,
    "centro_label": "Violaciones Procesales",
    "texto_esfera": "Violac Proces",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 10 },
      { "id": 35 },
      { "id": 136 },
      { "id": 143 },
      { "id": 51 },
      { "id": 8 },
      { "id": 130 },
      { "id": 50 }
    ]
  },
  {
    "id": 35,
    "centro_label": "Suplencia de la Queja",
    "texto_esfera": "Suplencia Queja",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 98 },
      { "id": 47 },
      { "id": 46 },
      { "id": 45 },
      { "id": 34 },
      { "id": 97 },
      { "id": 8 }
    ]
  },
  {
    "id": 36,
    "centro_label": "Inexistencia del Acto",
    "texto_esfera": "Inexist Acto",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 24 },
      { "id": 25 },
      { "id": 6 },
      { "id": 8 },
      { "id": 11 },
      { "id": 123 }
    ]
  },
  {
    "id": 37,
    "centro_label": "Actos Consumados",
    "texto_esfera": "Actos Consent",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 12 },
      { "id": 24 },
      { "id": 104 },
      { "id": 28 },
      { "id": 145 },
      { "id": 3 },
      { "id": 148 }
    ]
  },
  {
    "id": 38,
    "centro_label": "Acumulación",
    "texto_esfera": "Acumulación",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 24 },
      { "id": 39 },
      { "id": 183 },
      { "id": 109 },
      { "id": 44 },
      { "id": 3 }
    ]
  },
  {
    "id": 39,
    "centro_label": "Competencia",
    "texto_esfera": "Competencia",
    "capa": "Alta",
    "peso": 8,
    "satelites": [
      { "id": 9 },
      { "id": 10 },
      { "id": 73 },
      { "id": 148 }
    ]
  },
  {
    "id": 40,
    "centro_label": "Notificaciones",
    "texto_esfera": "Notificación",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 14 },
      { "id": 129 },
      { "id": 51 },
      { "id": 66 },
      { "id": 95 }
    ]
  },
  {
    "id": 41,
    "centro_label": "Exhorto",
    "texto_esfera": "Exhorto",
    "capa": "Baja",
    "peso": 4,
    "satelites": [
      { "id": 42 },
      { "id": 14 },
      { "id": 40 },
      { "id": 39 },
      { "id": 5 },
      { "id": 103 },
      { "id": 66 },
      { "id": 129 }
    ]
  },
  {
    "id": 42,
    "centro_label": "Despacho",
    "texto_esfera": "Despacho",
    "capa": "Baja",
    "peso": 6,
    "satelites": [
      { "id": 41 },
      { "id": 43 },
      { "id": 40 },
      { "id": 14 },
      { "id": 39 },
      { "id": 66 },
      { "id": 103 },
      { "id": 5 },
      { "id": 25 }
    ]
  },
  {
    "id": 43,
    "centro_label": "Requisitoria",
    "texto_esfera": "Requisitoria",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 41 },
      { "id": 42 },
      { "id": 40 },
      { "id": 14 },
      { "id": 39 },
      { "id": 66 },
      { "id": 25 },
      { "id": 103 }
    ]
  },
  {
    "id": 44,
    "centro_label": "Amparo Colectivo",
    "texto_esfera": "Amp Colectivo",
    "capa": "Baja",
    "peso": 6,
    "satelites": [
      { "id": 77 },
      { "id": 38 },
      { "id": 183 },
      { "id": 24 },
      { "id": 9 },
      { "id": 109 },
      { "id": 8 },
      { "id": 26 }
    ]
  },
  {
    "id": 45,
    "centro_label": "Amparo Penal",
    "texto_esfera": "Penal",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 86 },
      { "id": 129 },
      { "id": 12 },
      { "id": 114 },
      { "id": 35 }
    ]
  },
  {
    "id": 46,
    "centro_label": "Amparo Agrario",
    "texto_esfera": "Agrario",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 96 },
      { "id": 129 },
      { "id": 107 },
      { "id": 35 }
    ]
  },
  {
    "id": 47,
    "centro_label": "Amparo Laboral",
    "texto_esfera": "Amp Laboral",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 33 },
      { "id": 35 },
      { "id": 104 },
      { "id": 136 },
      { "id": 10 }
    ]
  },
  {
    "id": 48,
    "centro_label": "Amparo Fiscal",
    "texto_esfera": "Amp Fiscal",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 111 },
      { "id": 104 },
      { "id": 186 }
    ]
  },
  {
    "id": 49,
    "centro_label": "Incidente",
    "texto_esfera": "Incidente",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 113 },
      { "id": 51 },
      { "id": 50 },
      { "id": 158 },
      { "id": 157 },
      { "id": 25 },
      { "id": 129 },
      { "id": 125 }
    ]
  },
  {
    "id": 50,
    "centro_label": "Reposición",
    "texto_esfera": "Reposición",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 49 },
      { "id": 23 },
      { "id": 149 },
      { "id": 129 }
    ]
  },
  {
    "id": 51,
    "centro_label": "Nulidad",
    "texto_esfera": "Nulidad",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 40 },
      { "id": 49 },
      { "id": 8 },
      { "id": 13 },
      { "id": 3 },
      { "id": 24 },
      { "id": 50 },
      { "id": 34 }
    ]
  },
  {
    "id": 52,
    "centro_label": "Videograbación",
    "texto_esfera": "Videograb",
    "capa": "Baja",
    "peso": 4,
    "satelites": [
      { "id": 6 },
      { "id": 25 },
      { "id": 14 },
      { "id": 26 },
      { "id": 7 },
      { "id": 8 }
    ]
  },
  {
    "id": 53,
    "centro_label": "Prueba Testimonial",
    "texto_esfera": "P Testimoni",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 25 },
      { "id": 57 },
      { "id": 6 },
      { "id": 15 },
      { "id": 129 },
      { "id": 40 }
    ]
  },
  {
    "id": 54,
    "centro_label": "Prueba Pericial",
    "texto_esfera": "P Pericial",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 25 },
      { "id": 58 }
    ]
  },
  {
    "id": 55,
    "centro_label": "Inspección Judicial",
    "texto_esfera": "P Inspecc Jud",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 25 },
      { "id": 6 },
      { "id": 15 },
      { "id": 129 }
    ]
  },
  {
    "id": 56,
    "centro_label": "Confesional",
    "texto_esfera": "Confesional",
    "capa": "Media",
    "peso": 6,
    "satelites": []
  },
  {
    "id": 57,
    "centro_label": "Interrogatorio",
    "texto_esfera": "Interrogatio",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 53 },
      { "id": 15 },
      { "id": 129 },
      { "id": 54 },
      { "id": 40 },
      { "id": 6 }
    ]
  },
  {
    "id": 58,
    "centro_label": "Cuestionario",
    "texto_esfera": "Cuestionario",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 54 },
      { "id": 15 },
      { "id": 129 },
      { "id": 53 },
      { "id": 6 }
    ]
  },
  {
    "id": 59,
    "centro_label": "Firmeza",
    "texto_esfera": "Firmeza",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 8 },
      { "id": 60 },
      { "id": 124 },
      { "id": 145 },
      { "id": 129 },
      { "id": 123 },
      { "id": 40 },
      { "id": 125 },
      { "id": 148 }
    ]
  },
  {
    "id": 60,
    "centro_label": "Ejecutoria",
    "texto_esfera": "Ejecutoria",
    "capa": "Media",
    "peso": 9,
    "satelites": [
      { "id": 8 },
      { "id": 59 },
      { "id": 144 },
      { "id": 146 },
      { "id": 124 },
      { "id": 129 },
      { "id": 40 },
      { "id": 149 },
      { "id": 152 }
    ]
  },
  {
    "id": 61,
    "centro_label": "Engrose",
    "texto_esfera": "Engrose",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 8 },
      { "id": 10 },
      { "id": 129 },
      { "id": 62 },
      { "id": 40 }
    ]
  },
  {
    "id": 62,
    "centro_label": "Votación",
    "texto_esfera": "Votacion",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 8 },
      { "id": 175 },
      { "id": 176 },
      { "id": 63 },
      { "id": 61 },
      { "id": 10 },
      { "id": 39 }
    ]
  },
  {
    "id": 63,
    "centro_label": "Ponente",
    "texto_esfera": "Ponente",
    "capa": "Baja",
    "peso": 6,
    "satelites": [
      { "id": 178 },
      { "id": 8 },
      { "id": 10 },
      { "id": 129 },
      { "id": 62 },
      { "id": 39 },
      { "id": 64 },
      { "id": 61 }
    ]
  },
  {
    "id": 64,
    "centro_label": "Relator",
    "texto_esfera": "Relator",
    "capa": "Baja",
    "peso": 6,
    "satelites": [
      { "id": 63 },
      { "id": 178 },
      { "id": 8 },
      { "id": 10 },
      { "id": 62 },
      { "id": 61 },
      { "id": 39 }
    ]
  },
  {
    "id": 65,
    "centro_label": "Secretario",
    "texto_esfera": "Secretario",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 66 },
      { "id": 40 },
      { "id": 8 },
      { "id": 6 },
      { "id": 67 },
      { "id": 62 }
    ]
  },
  {
    "id": 66,
    "centro_label": "Actuario",
    "texto_esfera": "Actuario",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 40 },
      { "id": 65 },
      { "id": 41 },
      { "id": 67 }
    ]
  },
  {
    "id": 67,
    "centro_label": "Testigos de Asistencia",
    "texto_esfera": "Testigo Asist",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 66 },
      { "id": 40 },
      { "id": 65 },
      { "id": 6 },
      { "id": 39 }
    ]
  },
  {
    "id": 68,
    "centro_label": "Razón Circunstanciada",
    "texto_esfera": "Razón Circ",
    "capa": "Baja",
    "peso": 6,
    "satelites": [
      { "id": 66 },
      { "id": 40 },
      { "id": 67 }
    ]
  },
  {
    "id": 69,
    "centro_label": "Caso Fortuito",
    "texto_esfera": "Caso fortuito",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 70 },
      { "id": 14 },
      { "id": 104 },
      { "id": 71 },
      { "id": 40 },
      { "id": 129 }
    ]
  },
  {
    "id": 70,
    "centro_label": "Fuerza Mayor",
    "texto_esfera": "Fuerza Mayor",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 69 },
      { "id": 14 },
      { "id": 104 },
      { "id": 40 },
      { "id": 129 }
    ]
  },
  {
    "id": 71,
    "centro_label": "Fallas Técnicas",
    "texto_esfera": "Fallas Tec",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 14 },
      { "id": 69 },
      { "id": 104 },
      { "id": 70 },
      { "id": 40 },
      { "id": 129 }
    ]
  },
  {
    "id": 72,
    "centro_label": "Quejosa",
    "texto_esfera": "Quejosa",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 73 },
      { "id": 76 },
      { "id": 77 },
      { "id": 74 },
      { "id": 1 },
      { "id": 84 },
      { "id": 85 },
      { "id": 97 },
      { "id": 78 }
    ]
  },
  {
    "id": 73,
    "centro_label": "Autoridad Responsable",
    "texto_esfera": "Autor Resp",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 72 },
      { "id": 24 },
      { "id": 5 },
      { "id": 87 },
      { "id": 74 },
      { "id": 146 },
      { "id": 149 },
      { "id": 152 },
      { "id": 88 },
      { "id": 153 }
    ]
  },
  {
    "id": 74,
    "centro_label": "Tercero Interesado",
    "texto_esfera": "Tercer Inter",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 72 },
      { "id": 73 },
      { "id": 97 },
      { "id": 112 },
      { "id": 128 },
      { "id": 124 },
      { "id": 40 }
    ]
  },
  {
    "id": 75,
    "centro_label": "Ministerio Público",
    "texto_esfera": "Min Public",
    "capa": "Alta",
    "peso": 8,
    "satelites": [
      { "id": 72 },
      { "id": 73 },
      { "id": 97 },
      { "id": 45 },
      { "id": 86 },
      { "id": 121 },
      { "id": 122 },
      { "id": 87 },
      { "id": 124 },
      { "id": 92 }
    ]
  },
  {
    "id": 76,
    "centro_label": "Interés Jurídico",
    "texto_esfera": "InterésJur",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 72 },
      { "id": 79 },
      { "id": 77 },
      { "id": 78 },
      { "id": 24 },
      { "id": 30 },
      { "id": 8 },
      { "id": 74 }
    ]
  },
  {
    "id": 77,
    "centro_label": "Interés Legítimo",
    "texto_esfera": "Interes Leg",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 80 },
      { "id": 76 },
      { "id": 81 },
      { "id": 82 },
      { "id": 83 },
      { "id": 78 },
      { "id": 24 },
      { "id": 44 }
    ]
  },
  {
    "id": 78,
    "centro_label": "Interés Simple",
    "texto_esfera": "Interes Simple",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 76 },
      { "id": 77 },
      { "id": 12 },
      { "id": 72 },
      { "id": 3 },
      { "id": 11 }
    ]
  },
  {
    "id": 79,
    "centro_label": "Derecho Subjetivo",
    "texto_esfera": "Der Subjetivo",
    "capa": "Baja",
    "peso": 6,
    "satelites": [
      { "id": 76 },
      { "id": 24 },
      { "id": 77 },
      { "id": 39 },
      { "id": 8 },
      { "id": 10 },
      { "id": 30 },
      { "id": 72 }
    ]
  },
  {
    "id": 80,
    "centro_label": "Afectación Real",
    "texto_esfera": "Afect Real",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 77 },
      { "id": 72 },
      { "id": 81 },
      { "id": 82 },
      { "id": 24 },
      { "id": 76 },
      { "id": 83 },
      { "id": 78 },
      { "id": 44 }
    ]
  },
  {
    "id": 81,
    "centro_label": "Afectación Diferenciada",
    "texto_esfera": "Afect Difer",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 77 },
      { "id": 80 },
      { "id": 72 },
      { "id": 82 },
      { "id": 24 },
      { "id": 83 },
      { "id": 76 },
      { "id": 44 },
      { "id": 78 }
    ]
  },
  {
    "id": 82,
    "centro_label": "Lesión Jurídica",
    "texto_esfera": "Lesión Jur",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 77 },
      { "id": 72 },
      { "id": 80 },
      { "id": 24 },
      { "id": 81 },
      { "id": 83 },
      { "id": 76 }
    ]
  },
  {
    "id": 83,
    "centro_label": "Beneficio Cierto",
    "texto_esfera": "Benef Cierto",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 77 },
      { "id": 72 },
      { "id": 82 },
      { "id": 80 },
      { "id": 24 },
      { "id": 76 },
      { "id": 8 },
      { "id": 28 }
    ]
  },
  {
    "id": 84,
    "centro_label": "Representante Legal",
    "texto_esfera": "Rep Legal",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 72 },
      { "id": 98 },
      { "id": 99 },
      { "id": 85 },
      { "id": 101 },
      { "id": 100 },
      { "id": 184 }
    ]
  },
  {
    "id": 85,
    "centro_label": "Apoderado",
    "texto_esfera": "Apoderado",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 72 },
      { "id": 84 },
      { "id": 103 },
      { "id": 102 },
      { "id": 101 },
      { "id": 40 },
      { "id": 14 }
    ]
  },
  {
    "id": 86,
    "centro_label": "Defensor/a Penal",
    "texto_esfera": "Defensor Penal",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 72 },
      { "id": 45 },
      { "id": 75 },
      { "id": 149 },
      { "id": 85 }
    ]
  },
  {
    "id": 87,
    "centro_label": "Superior Jerárquico",
    "texto_esfera": "Sup Jerarq",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 73 },
      { "id": 146 },
      { "id": 161 },
      { "id": 149 },
      { "id": 152 },
      { "id": 153 },
      { "id": 145 },
      { "id": 151 },
      { "id": 39 },
      { "id": 40 }
    ]
  },
  {
    "id": 88,
    "centro_label": "Particular como Autoridad",
    "texto_esfera": "Particular",
    "capa": "Baja",
    "peso": 6,
    "satelites": [
      { "id": 73 },
      { "id": 13 },
      { "id": 85 },
      { "id": 24 },
      { "id": 104 }
    ]
  },
  {
    "id": 89,
    "centro_label": "Promovente",
    "texto_esfera": "Promovente",
    "capa": "Media",
    "peso": 6,
    "satelites": [
      { "id": 72 },
      { "id": 1 },
      { "id": 2 },
      { "id": 18 },
      { "id": 101 },
      { "id": 84 },
      { "id": 149 },
      { "id": 13 },
      { "id": 16 },
      { "id": 129 }
    ]
  },
  {
    "id": 90,
    "centro_label": "Recurrente",
    "texto_esfera": "Recurrente",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 124 },
      { "id": 125 },
      { "id": 130 },
      { "id": 129 },
      { "id": 72 },
      { "id": 73 },
      { "id": 131 },
      { "id": 15 },
      { "id": 8 }
    ]
  },
  {
    "id": 91,
    "centro_label": "Adherente",
    "texto_esfera": "Adherente",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 74 },
      { "id": 124 },
      { "id": 130 },
      { "id": 129 },
      { "id": 143 },
      { "id": 131 }
    ]
  },
  {
    "id": 92,
    "centro_label": "Desistimiento",
    "texto_esfera": "Desistimiento",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 11 },
      { "id": 72 },
      { "id": 40 },
      { "id": 93 },
      { "id": 96 },
      { "id": 129 },
      { "id": 151 },
      { "id": 124 }
    ]
  },
  {
    "id": 93,
    "centro_label": "Desistimiento Tácito",
    "texto_esfera": "Dessi Tácito",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 92 },
      { "id": 11 },
      { "id": 72 },
      { "id": 150 },
      { "id": 129 },
      { "id": 2 },
      { "id": 40 },
      { "id": 59 }
    ]
  },
  {
    "id": 94,
    "centro_label": "Muerte de la Quejosa",
    "texto_esfera": "Muerte Quejosa",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 11 },
      { "id": 72 },
      { "id": 24 },
      { "id": 84 },
      { "id": 184 },
      { "id": 104 },
      { "id": 129 },
      { "id": 40 },
      { "id": 74 }
    ]
  },
  {
    "id": 95,
    "centro_label": "Edictos",
    "texto_esfera": "Edictos",
    "capa": "Media",
    "peso": 6,
    "satelites": [
      { "id": 40 },
      { "id": 74 },
      { "id": 11 },
      { "id": 72 },
      { "id": 129 }
    ]
  },
  {
    "id": 96,
    "centro_label": "Asamblea Ejidal",
    "texto_esfera": "Asamblea Ejidal",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 92 },
      { "id": 11 },
      { "id": 183 },
      { "id": 46 }
    ]
  },
  {
    "id": 97,
    "centro_label": "Víctima u Ofendida",
    "texto_esfera": "Víctima",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 72 },
      { "id": 45 },
      { "id": 74 },
      { "id": 75 },
      { "id": 8 },
      { "id": 35 },
      { "id": 128 },
      { "id": 124 }
    ]
  },
  {
    "id": 98,
    "centro_label": "Menor de Edad",
    "texto_esfera": "Menor de Edad",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 35 },
      { "id": 84 },
      { "id": 72 },
      { "id": 99 },
      { "id": 104 }
    ]
  },
  {
    "id": 99,
    "centro_label": "Incapaz",
    "texto_esfera": "Incapaz",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 35 },
      { "id": 84 },
      { "id": 72 },
      { "id": 98 }
    ]
  },
  {
    "id": 100,
    "centro_label": "Persona Moral",
    "texto_esfera": "Persona Moral",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 72 },
      { "id": 84 },
      { "id": 111 },
      { "id": 8 },
      { "id": 44 }
    ]
  },
  {
    "id": 101,
    "centro_label": "Acreditación",
    "texto_esfera": "Acreditación",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 84 },
      { "id": 85 },
      { "id": 89 },
      { "id": 5 },
      { "id": 10 },
      { "id": 45 },
      { "id": 149 }
    ]
  },
  {
    "id": 102,
    "centro_label": "Abogado",
    "texto_esfera": "Abogado",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 85 },
      { "id": 86 },
      { "id": 84 },
      { "id": 101 },
      { "id": 40 }
    ]
  },
  {
    "id": 103,
    "centro_label": "Poder Notarial",
    "texto_esfera": "Poder Not",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 85 },
      { "id": 84 },
      { "id": 101 },
      { "id": 72 },
      { "id": 102 }
    ]
  },
  {
    "id": 104,
    "centro_label": "Suspensión del Acto",
    "texto_esfera": "Suspension",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 105 },
      { "id": 106 },
      { "id": 107 },
      { "id": 108 },
      { "id": 109 },
      { "id": 113 },
      { "id": 110 },
      { "id": 111 },
      { "id": 24 },
      { "id": 124 }
    ]
  },
  {
    "id": 105,
    "centro_label": "Suspensión Provisional",
    "texto_esfera": "Susp Prov",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 104 },
      { "id": 106 },
      { "id": 110 },
      { "id": 1 },
      { "id": 5 },
      { "id": 113 },
      { "id": 108 }
    ]
  },
  {
    "id": 106,
    "centro_label": "Suspensión Definitiva",
    "texto_esfera": "Susp Defin",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 104 },
      { "id": 105 },
      { "id": 113 },
      { "id": 108 },
      { "id": 109 },
      { "id": 5 },
      { "id": 111 },
      { "id": 124 }
    ]
  },
  {
    "id": 107,
    "centro_label": "Suspensión de Oficio",
    "texto_esfera": "Susp Ofi",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 104 },
      { "id": 46 },
      { "id": 4 }
    ]
  },
  {
    "id": 108,
    "centro_label": "Apariencia del Buen Derecho",
    "texto_esfera": "Buen Derecho",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 104 },
      { "id": 109 },
      { "id": 106 },
      { "id": 105 }
    ]
  },
  {
    "id": 109,
    "centro_label": "Interés Social",
    "texto_esfera": "Inter Social",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 104 },
      { "id": 108 },
      { "id": 98 }
    ]
  },
  {
    "id": 110,
    "centro_label": "Peligro Inminente",
    "texto_esfera": "Peligro Inm",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 105 },
      { "id": 104 },
      { "id": 24 },
      { "id": 114 },
      { "id": 108 }
    ]
  },
  {
    "id": 111,
    "centro_label": "Garantía (Fianza)",
    "texto_esfera": "Garantía",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 104 },
      { "id": 112 },
      { "id": 74 },
      { "id": 185 },
      { "id": 186 },
      { "id": 46 },
      { "id": 100 },
      { "id": 129 },
      { "id": 187 }
    ]
  },
  {
    "id": 112,
    "centro_label": "Contragarantía",
    "texto_esfera": "Contragarant",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 111 },
      { "id": 74 },
      { "id": 104 }
    ]
  },
  {
    "id": 113,
    "centro_label": "Incidente de Suspensión",
    "texto_esfera": "Inc Suspensión",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 104 },
      { "id": 105 },
      { "id": 106 },
      { "id": 5 },
      { "id": 25 },
      { "id": 124 }
    ]
  },
  {
    "id": 114,
    "centro_label": "Medidas Cautelares",
    "texto_esfera": "Med Cautelal",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 104 },
      { "id": 105 },
      { "id": 110 },
      { "id": 115 },
      { "id": 13 },
      { "id": 40 }
    ]
  },
  {
    "id": 115,
    "centro_label": "Prisión Preventiva Oficiosa",
    "texto_esfera": "Prision Prev",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 104 },
      { "id": 39 },
      { "id": 114 },
      { "id": 124 }
    ]
  },
  {
    "id": 116,
    "centro_label": "Flagrancia",
    "texto_esfera": "Flagrancia",
    "capa": "Baja",
    "peso": 6,
    "satelites": [
      { "id": 75 },
      { "id": 39 },
      { "id": 120 }
    ]
  },
  {
    "id": 117,
    "centro_label": "Reaprehensión",
    "texto_esfera": "Reapreh",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 45 },
      { "id": 104 },
      { "id": 115 },
      { "id": 12 },
      { "id": 114 },
      { "id": 39 },
      { "id": 124 },
      { "id": 75 }
    ]
  },
  {
    "id": 118,
    "centro_label": "Vinculación a Proceso",
    "texto_esfera": "Vinc Proc",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 12 },
      { "id": 45 },
      { "id": 8 },
      { "id": 104 },
      { "id": 9 },
      { "id": 34 },
      { "id": 40 },
      { "id": 39 }
    ]
  },
  {
    "id": 119,
    "centro_label": "Extinción de Dominio",
    "texto_esfera": "Ext Dominio",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 104 },
      { "id": 74 },
      { "id": 72 },
      { "id": 120 }
    ]
  },
  {
    "id": 120,
    "centro_label": "Delincuencia Organizada",
    "texto_esfera": "Delinc Org",
    "capa": "Baja",
    "peso": 6,
    "satelites": [
      { "id": 104 },
      { "id": 129 },
      { "id": 115 },
      { "id": 116 },
      { "id": 45 },
      { "id": 75 },
      { "id": 114 },
      { "id": 119 }
    ]
  },
  {
    "id": 121,
    "centro_label": "Investigación del Delito",
    "texto_esfera": "Investig Del",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 75 },
      { "id": 9 },
      { "id": 122 },
      { "id": 97 },
      { "id": 72 },
      { "id": 104 }
    ]
  },
  {
    "id": 122,
    "centro_label": "No Ejercicio de la Acción",
    "texto_esfera": "No Ejercicio",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 75 },
      { "id": 9 },
      { "id": 121 },
      { "id": 92 },
      { "id": 97 },
      { "id": 72 },
      { "id": 104 },
      { "id": 87 },
      { "id": 124 }
    ]
  },
  {
    "id": 123,
    "centro_label": "Cosa Juzgada",
    "texto_esfera": "Cosa Juzgada",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 8 },
      { "id": 60 },
      { "id": 59 },
      { "id": 12 },
      { "id": 28 },
      { "id": 124 },
      { "id": 129 },
      { "id": 40 },
      { "id": 145 }
    ]
  },
  {
    "id": 124,
    "centro_label": "Recurso de Revisión",
    "texto_esfera": "Revisión",
    "capa": "Media",
    "peso": 9,
    "satelites": [
      { "id": 8 },
      { "id": 106 },
      { "id": 11 },
      { "id": 130 },
      { "id": 129 },
      { "id": 131 },
      { "id": 39 },
      { "id": 9 },
      { "id": 10 },
      { "id": 60 }
    ]
  },
  {
    "id": 125,
    "centro_label": "Recurso de Queja",
    "texto_esfera": "Queja",
    "capa": "Baja",
    "peso": 7,
    "satelites": [
      { "id": 3 },
      { "id": 105 },
      { "id": 4 },
      { "id": 74 },
      { "id": 130 },
      { "id": 129 },
      { "id": 15 },
      { "id": 73 },
      { "id": 104 }
    ]
  },
  {
    "id": 126,
    "centro_label": "Recurso de Reclamación",
    "texto_esfera": "Reclamación",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 130 },
      { "id": 63 },
      { "id": 10 },
      { "id": 59 }
    ]
  },
  {
    "id": 127,
    "centro_label": "Recurso de Inconformidad",
    "texto_esfera": "Inconformid",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 145 },
      { "id": 156 },
      { "id": 146 },
      { "id": 129 },
      { "id": 72 },
      { "id": 74 },
      { "id": 10 }
    ]
  },
  {
    "id": 128,
    "centro_label": "Amparo Adhesivo",
    "texto_esfera": "Amp Adhesivo",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 74 },
      { "id": 124 },
      { "id": 130 },
      { "id": 34 },
      { "id": 143 },
      { "id": 8 },
      { "id": 131 }
    ]
  },
  {
    "id": 129,
    "centro_label": "Plazo para Recurrir",
    "texto_esfera": "Plazo Recurrir",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 124 },
      { "id": 125 },
      { "id": 126 },
      { "id": 127 },
      { "id": 131 },
      { "id": 140 },
      { "id": 40 },
      { "id": 142 }
    ]
  },
  {
    "id": 130,
    "centro_label": "Agravios",
    "texto_esfera": "Agravios",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 124 },
      { "id": 125 },
      { "id": 126 },
      { "id": 10 },
      { "id": 15 },
      { "id": 150 },
      { "id": 35 },
      { "id": 131 }
    ]
  },
  {
    "id": 131,
    "centro_label": "Adhesión al Recurso",
    "texto_esfera": "Adhesión",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 124 },
      { "id": 129 },
      { "id": 130 },
      { "id": 40 },
      { "id": 143 },
      { "id": 8 }
    ]
  },
  {
    "id": 132,
    "centro_label": "Efectos del Recurso",
    "texto_esfera": "Efectos",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 124 },
      { "id": 106 },
      { "id": 28 },
      { "id": 8 },
      { "id": 113 }
    ]
  },
  {
    "id": 133,
    "centro_label": "Recursos en Amparo Directo",
    "texto_esfera": "Rec Amp Direct",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 125 },
      { "id": 124 },
      { "id": 3 },
      { "id": 10 },
      { "id": 39 }
    ]
  },
  {
    "id": 134,
    "centro_label": "Recursos en Amparo Indirecto",
    "texto_esfera": "Rec Amp Indir",
    "capa": "Baja",
    "peso": 6,
    "satelites": [
      { "id": 9 },
      { "id": 124 },
      { "id": 125 },
      { "id": 106 },
      { "id": 11 },
      { "id": 6 },
      { "id": 4 },
      { "id": 105 },
      { "id": 74 },
      { "id": 113 }
    ]
  },
  {
    "id": 135,
    "centro_label": "Revisión Adhesiva",
    "texto_esfera": "Rev Adhesiva",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 124 },
      { "id": 131 },
      { "id": 128 },
      { "id": 129 },
      { "id": 130 },
      { "id": 8 },
      { "id": 143 }
    ]
  },
  {
    "id": 136,
    "centro_label": "Recursos Ordinarios",
    "texto_esfera": "Recurso Ordin",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 10 },
      { "id": 12 },
      { "id": 32 },
      { "id": 33 },
      { "id": 34 },
      { "id": 72 },
      { "id": 129 }
    ]
  },
  {
    "id": 137,
    "centro_label": "Facultad de Atracción",
    "texto_esfera": "Atracción",
    "capa": "Media",
    "peso": 6,
    "satelites": []
  },
  {
    "id": 138,
    "centro_label": "Medios de Impugnación",
    "texto_esfera": "Impugnación",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 124 },
      { "id": 125 },
      { "id": 126 },
      { "id": 127 },
      { "id": 128 },
      { "id": 15 },
      { "id": 129 },
      { "id": 130 },
      { "id": 14 }
    ]
  },
  {
    "id": 139,
    "centro_label": "Cómputo de Plazos",
    "texto_esfera": "Cómputo Plazos",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 129 },
      { "id": 140 },
      { "id": 40 },
      { "id": 45 },
      { "id": 14 },
      { "id": 69 },
      { "id": 70 },
      { "id": 71 }
    ]
  },
  {
    "id": 140,
    "centro_label": "Días Inhábiles",
    "texto_esfera": "Días Inhabil",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 139 },
      { "id": 45 },
      { "id": 4 },
      { "id": 70 },
      { "id": 40 }
    ]
  },
  {
    "id": 141,
    "centro_label": "Prórroga",
    "texto_esfera": "Prórroga",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 129 },
      { "id": 5 },
      { "id": 25 },
      { "id": 6 }
    ]
  },
  {
    "id": 142,
    "centro_label": "Caducidad",
    "texto_esfera": "Caducidad",
    "capa": "Baja",
    "peso": 6,
    "satelites": [
      { "id": 129 },
      { "id": 111 },
      { "id": 112 },
      { "id": 40 },
      { "id": 143 },
      { "id": 39 }
    ]
  },
  {
    "id": 143,
    "centro_label": "Preclusión",
    "texto_esfera": "Preclusión",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 34 },
      { "id": 128 },
      { "id": 129 },
      { "id": 35 },
      { "id": 142 },
      { "id": 59 }
    ]
  },
  {
    "id": 144,
    "centro_label": "Cumplimiento Voluntario",
    "texto_esfera": "Cumpl Voluntario",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 60 },
      { "id": 73 },
      { "id": 5 },
      { "id": 72 },
      { "id": 158 },
      { "id": 129 },
      { "id": 10 }
    ]
  },
  {
    "id": 145,
    "centro_label": "Cumplimiento de Sentencias",
    "texto_esfera": "Cumpl Sentencia",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 60 },
      { "id": 144 },
      { "id": 146 },
      { "id": 149 },
      { "id": 150 },
      { "id": 151 },
      { "id": 87 },
      { "id": 127 },
      { "id": 157 },
      { "id": 156 }
    ]
  },
  {
    "id": 146,
    "centro_label": "Incumplimiento",
    "texto_esfera": "Incumplimiento",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 60 },
      { "id": 149 },
      { "id": 150 },
      { "id": 159 },
      { "id": 152 },
      { "id": 153 },
      { "id": 73 }
    ]
  },
  {
    "id": 147,
    "centro_label": "Inejecución",
    "texto_esfera": "Inejecución",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 146 },
      { "id": 60 },
      { "id": 159 },
      { "id": 10 },
      { "id": 39 },
      { "id": 152 },
      { "id": 40 }
    ]
  },
  {
    "id": 148,
    "centro_label": "Ejecución",
    "texto_esfera": "Ejecución",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 8 },
      { "id": 145 },
      { "id": 24 },
      { "id": 104 },
      { "id": 162 },
      { "id": 163 },
      { "id": 41 },
      { "id": 45 }
    ]
  },
  {
    "id": 149,
    "centro_label": "Multa",
    "texto_esfera": "Multa",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 146 },
      { "id": 73 },
      { "id": 87 },
      { "id": 151 },
      { "id": 21 },
      { "id": 101 },
      { "id": 50 },
      { "id": 47 }
    ]
  },
  {
    "id": 150,
    "centro_label": "Requerimiento",
    "texto_esfera": "Requerimiento",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 146 },
      { "id": 73 },
      { "id": 87 },
      { "id": 129 },
      { "id": 151 },
      { "id": 40 },
      { "id": 149 },
      { "id": 159 },
      { "id": 104 }
    ]
  },
  {
    "id": 151,
    "centro_label": "Apercibimiento",
    "texto_esfera": "Apercibimiento",
    "capa": "Baja",
    "peso": 6,
    "satelites": [
      { "id": 150 },
      { "id": 149 },
      { "id": 146 },
      { "id": 73 },
      { "id": 87 },
      { "id": 40 },
      { "id": 129 },
      { "id": 162 },
      { "id": 152 },
      { "id": 153 }
    ]
  },
  {
    "id": 152,
    "centro_label": "Separación del Cargo",
    "texto_esfera": "Sep Cargo",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 146 },
      { "id": 87 },
      { "id": 153 },
      { "id": 39 },
      { "id": 154 },
      { "id": 73 }
    ]
  },
  {
    "id": 153,
    "centro_label": "Consignación Penal",
    "texto_esfera": "Consig Penal",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 146 },
      { "id": 73 },
      { "id": 152 },
      { "id": 87 },
      { "id": 149 },
      { "id": 154 },
      { "id": 39 },
      { "id": 75 }
    ]
  },
  {
    "id": 154,
    "centro_label": "Inhabilitación",
    "texto_esfera": "Inhabilitación",
    "capa": "Baja",
    "peso": 6,
    "satelites": [
      { "id": 152 },
      { "id": 149 },
      { "id": 153 },
      { "id": 73 },
      { "id": 146 },
      { "id": 39 },
      { "id": 178 },
      { "id": 177 }
    ]
  },
  {
    "id": 155,
    "centro_label": "Destitución",
    "texto_esfera": "Destitución",
    "capa": "Baja",
    "peso": 6,
    "satelites": [
      { "id": 152 },
      { "id": 149 },
      { "id": 153 },
      { "id": 154 },
      { "id": 146 },
      { "id": 73 },
      { "id": 87 },
      { "id": 39 }
    ]
  },
  {
    "id": 156,
    "centro_label": "Repetición del Acto",
    "texto_esfera": "Repet del Actp",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 146 },
      { "id": 24 },
      { "id": 73 },
      { "id": 129 },
      { "id": 5 },
      { "id": 159 }
    ]
  },
  {
    "id": 157,
    "centro_label": "Cumplimiento Sustituto",
    "texto_esfera": "Cumpl Sustituto",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 60 },
      { "id": 72 },
      { "id": 49 },
      { "id": 125 }
    ]
  },
  {
    "id": 158,
    "centro_label": "Exceso o Defecto",
    "texto_esfera": "Exces o Defec",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 145 },
      { "id": 104 },
      { "id": 49 },
      { "id": 39 },
      { "id": 5 },
      { "id": 113 },
      { "id": 150 }
    ]
  },
  {
    "id": 159,
    "centro_label": "Incidente de Inejecución",
    "texto_esfera": "Inc Inejec",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 147 },
      { "id": 146 },
      { "id": 39 },
      { "id": 40 },
      { "id": 152 },
      { "id": 10 }
    ]
  },
  {
    "id": 160,
    "centro_label": "Responsabilidad del Superior",
    "texto_esfera": "Resp Superior",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 87 },
      { "id": 73 },
      { "id": 146 },
      { "id": 149 },
      { "id": 152 },
      { "id": 153 },
      { "id": 145 },
      { "id": 40 },
      { "id": 151 }
    ]
  },
  {
    "id": 161,
    "centro_label": "Consecuencias",
    "texto_esfera": "Consecuencias",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 146 },
      { "id": 149 },
      { "id": 150 },
      { "id": 159 },
      { "id": 152 },
      { "id": 153 },
      { "id": 154 },
      { "id": 21 },
      { "id": 155 },
      { "id": 87 }
    ]
  },
  {
    "id": 162,
    "centro_label": "Medios de Apremio",
    "texto_esfera": "Medios Apremuio",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 149 },
      { "id": 163 },
      { "id": 153 },
      { "id": 146 },
      { "id": 116 },
      { "id": 41 },
      { "id": 104 }
    ]
  },
  {
    "id": 163,
    "centro_label": "Fuerza Pública",
    "texto_esfera": "Fuerza Pública",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 162 },
      { "id": 148 },
      { "id": 146 },
      { "id": 109 },
      { "id": 6 },
      { "id": 40 }
    ]
  },
  {
    "id": 164,
    "centro_label": "Mala Fe",
    "texto_esfera": "Mala Fe",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 149 },
      { "id": 158 },
      { "id": 111 },
      { "id": 40 },
      { "id": 39 },
      { "id": 104 },
      { "id": 156 }
    ]
  },
  {
    "id": 165,
    "centro_label": "Jurisprudencia",
    "texto_esfera": "Jurisprudenc",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 8 },
      { "id": 166 },
      { "id": 175 },
      { "id": 62 },
      { "id": 171 },
      { "id": 172 },
      { "id": 170 },
      { "id": 30 },
      { "id": 26 }
    ]
  },
  {
    "id": 166,
    "centro_label": "Contradicción de Tesis",
    "texto_esfera": "Contrad Tesis",
    "capa": "Alta",
    "peso": 10,
    "satelites": []
  },
  {
    "id": 167,
    "centro_label": "Reiteración",
    "texto_esfera": "Reiteración",
    "capa": "Media",
    "peso": 7,
    "satelites": []
  },
  {
    "id": 168,
    "centro_label": "Precedentes Obligatorios",
    "texto_esfera": "Preced Oblig",
    "capa": "Media",
    "peso": 8,
    "satelites": []
  },
  {
    "id": 169,
    "centro_label": "Precedente",
    "texto_esfera": "Precedente",
    "capa": "Media",
    "peso": 6,
    "satelites": []
  },
  {
    "id": 170,
    "centro_label": "Declaratoria General de Inconstitucionalidad",
    "texto_esfera": "Decl Inconstituc",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 165 },
      { "id": 30 },
      { "id": 129 },
      { "id": 40 },
      { "id": 39 },
      { "id": 175 }
    ]
  },
  {
    "id": 171,
    "centro_label": "Plenos Regionales",
    "texto_esfera": "Plenos Reg",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 165 },
      { "id": 10 },
      { "id": 39 },
      { "id": 170 },
      { "id": 175 },
      { "id": 9 }
    ]
  },
  {
    "id": 172,
    "centro_label": "Semanario Judicial de la Federación",
    "texto_esfera": "Sem Judicial",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 165 },
      { "id": 39 },
      { "id": 26 },
      { "id": 62 },
      { "id": 14 }
    ]
  },
  {
    "id": 173,
    "centro_label": "Tesis Aislada",
    "texto_esfera": "Tesis Aislada",
    "capa": "Media",
    "peso": 6,
    "satelites": []
  },
  {
    "id": 174,
    "centro_label": "Rubro",
    "texto_esfera": "Rubro",
    "capa": "Baja",
    "peso": 5,
    "satelites": []
  },
  {
    "id": 175,
    "centro_label": "Mayoría",
    "texto_esfera": "Mayoría",
    "capa": "Alta",
    "peso": 10,
    "satelites": [
      { "id": 8 },
      { "id": 165 },
      { "id": 176 },
      { "id": 62 },
      { "id": 39 },
      { "id": 10 },
      { "id": 170 }
    ]
  },
  {
    "id": 176,
    "centro_label": "Unanimidad",
    "texto_esfera": "Unanimidada",
    "capa": "Alta",
    "peso": 9,
    "satelites": [
      { "id": 8 },
      { "id": 175 },
      { "id": 10 },
      { "id": 165 }
    ]
  },
  {
    "id": 177,
    "centro_label": "Ministro/a de la SCJN",
    "texto_esfera": "Ministro",
    "capa": "Baja",
    "peso": 6,
    "satelites": [
      { "id": 39 },
      { "id": 178 },
      { "id": 63 },
      { "id": 62 },
      { "id": 165 }
    ]
  },
  {
    "id": 178,
    "centro_label": "Magistrado/a de Circuito",
    "texto_esfera": "Magistrado",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 10 },
      { "id": 177 },
      { "id": 62 },
      { "id": 63 },
      { "id": 64 },
      { "id": 39 }
    ]
  },
  {
    "id": 179,
    "centro_label": "Agraviado",
    "texto_esfera": "Agraviado",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 72 },
      { "id": 8 },
      { "id": 60 },
      { "id": 146 },
      { "id": 158 },
      { "id": 127 },
      { "id": 104 },
      { "id": 129 }
    ]
  },
  {
    "id": 180,
    "centro_label": "Comisión Nacional de Derechos Humanos",
    "texto_esfera": "CNDH",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 45 },
      { "id": 75 },
      { "id": 97 },
      { "id": 72 },
      { "id": 73 },
      { "id": 23 },
      { "id": 5 }
    ]
  },
  {
    "id": 181,
    "centro_label": "Fiscalía General de la República",
    "texto_esfera": "FGR",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 75 },
      { "id": 45 },
      { "id": 124 },
      { "id": 146 },
      { "id": 121 },
      { "id": 122 },
      { "id": 92 },
      { "id": 39 },
      { "id": 171 }
    ]
  },
  {
    "id": 182,
    "centro_label": "Particulares en auxilio de la justicia",
    "texto_esfera": "Part en Auxilio",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 39 },
      { "id": 9 },
      { "id": 107 },
      { "id": 110 },
      { "id": 66 },
      { "id": 40 },
      { "id": 41 },
      { "id": 42 },
      { "id": 43 },
      { "id": 6 }
    ]
  },
  {
    "id": 183,
    "centro_label": "Representante Común",
    "texto_esfera": "Rep Común",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 44 },
      { "id": 38 },
      { "id": 72 },
      { "id": 77 },
      { "id": 84 },
      { "id": 85 },
      { "id": 109 },
      { "id": 40 }
    ]
  },
  {
    "id": 184,
    "centro_label": "Sucesión",
    "texto_esfera": "Sucesión",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 94 },
      { "id": 72 },
      { "id": 84 },
      { "id": 11 },
      { "id": 74 },
      { "id": 129 },
      { "id": 104 },
      { "id": 40 }
    ]
  },
  {
    "id": 185,
    "centro_label": "Fianza",
    "texto_esfera": "Fianza",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 111 },
      { "id": 104 },
      { "id": 112 },
      { "id": 158 },
      { "id": 164 },
      { "id": 186 },
      { "id": 187 },
      { "id": 188 },
      { "id": 74 }
    ]
  },
  {
    "id": 186,
    "centro_label": "Depósito",
    "texto_esfera": "Depósito",
    "capa": "Media",
    "peso": 8,
    "satelites": [
      { "id": 111 },
      { "id": 104 },
      { "id": 185 },
      { "id": 48 },
      { "id": 149 },
      { "id": 187 },
      { "id": 158 }
    ]
  },
  {
    "id": 187,
    "centro_label": "Hipoteca",
    "texto_esfera": "Hipoteca",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 111 },
      { "id": 185 },
      { "id": 186 },
      { "id": 104 },
      { "id": 112 }
    ]
  },
  {
    "id": 188,
    "centro_label": "Contrafianza",
    "texto_esfera": "Contrafianza",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 112 },
      { "id": 185 },
      { "id": 111 },
      { "id": 74 },
      { "id": 104 },
      { "id": 158 },
      { "id": 164 }
    ]
  },
  {
    "id": 189,
    "centro_label": "Incumplimiento de la Suspensión",
    "texto_esfera": "Incumpl Susp",
    "capa": "Media",
    "peso": 7,
    "satelites": [
      { "id": 104 },
      { "id": 158 },
      { "id": 73 },
      { "id": 49 },
      { "id": 149 },
      { "id": 164 },
      { "id": 150 },
      { "id": 75 },
      { "id": 111 }
    ]
  },
  {
    "id": 190,
    "centro_label": "Cumplimiento Extemporáneo",
    "texto_esfera": "Cumpl Extemp",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 145 },
      { "id": 146 },
      { "id": 60 },
      { "id": 149 },
      { "id": 73 },
      { "id": 129 }
    ]
  },
  {
    "id": 191,
    "centro_label": "Justificación de Retraso",
    "texto_esfera": "Just de Retraso",
    "capa": "Baja",
    "peso": 5,
    "satelites": [
      { "id": 146 },
      { "id": 190 },
      { "id": 141 },
      { "id": 145 },
      { "id": 73 },
      { "id": 129 },
      { "id": 151 }
    ]
  }
];

// Log de verificación
if (typeof console !== 'undefined') {
  console.log(`╔════════════════════════════════════════════════════════════════╗`);
  console.log(`║  📚 GRAFOS_DATA cargado correctamente                         ║`);
  console.log(`╚════════════════════════════════════════════════════════════════╝`);
  console.log(`  ✅ ${GRAFOS_DATA.length} nodos conceptuales`);
  console.log(`  ✅ Estructura: id, centro_label, texto_esfera, capa, peso, satelites`);
  console.log(`  ✅ Listo para usar con Three.js`);
}