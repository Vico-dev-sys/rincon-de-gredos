/* ============================================================
   LAS 6 HABITACIONES · El Rincón de Gredos
   Para cambiar un precio, edita "precioBaja" o "precioAlta".
   "img" = ruta de la foto (o null para usar el marcador de marca).
   ============================================================ */

window.HABITACIONES = [
  {
    id: "almanzor",
    nombre: "Almanzor",
    tipo: "Doble con balcón y vistas al circo",
    capacidad: 2,
    precioBaja: 95,
    precioAlta: 130,
    servicios: ["Balcón con vistas al circo", "Baño privado", "Ropa de cama de lino"],
    descripcion: "La habitación con las mejores vistas de la casa. Al abrir el balcón, el circo de Gredos entero.",
    img: "assets/hab-almanzor-balcon.jpg",
    alt: "Habitación Almanzor con balcón abierto y vistas al circo de Gredos"
  },
  {
    id: "la-mira",
    nombre: "La Mira",
    tipo: "Doble con balcón, chimenea y bañera de hidromasaje",
    capacidad: 2,
    precioBaja: 90,
    precioAlta: 120,
    servicios: ["Bañera de hidromasaje", "Chimenea de leña", "Balcón con vistas al olivar"],
    descripcion: "La más romántica. Chimenea de leña, bañera de hidromasaje de piedra y un balcón en arco que se abre al olivar y la sierra.",
    img: "assets/hab-lamira.jpg",
    alt: "Habitación La Mira con chimenea, bañera de hidromasaje de piedra y balcón en arco con vistas al olivar"
  },
  {
    id: "el-pinar",
    nombre: "El Pinar",
    tipo: "Doble con vistas al bosque",
    capacidad: 2,
    precioBaja: 85,
    precioAlta: 110,
    servicios: ["Vistas al pinar", "Baño privado", "Viga vista"],
    descripcion: "Te duermes con el pinar delante y el viento entre los árboles. Nada más.",
    img: null,
    alt: "Habitación El Pinar con vistas al bosque"
  },
  {
    id: "los-galayos",
    nombre: "Los Galayos",
    tipo: "Twin · dos camas individuales",
    capacidad: 2,
    precioBaja: 85,
    precioAlta: 110,
    servicios: ["Dos camas individuales", "Baño privado", "Muro de piedra vista"],
    descripcion: "Dos camas separadas, paredes de piedra y la sobriedad de la montaña. Ideal para amigos.",
    img: "assets/hab-twin-piedra.jpg",
    alt: "Habitación Los Galayos con dos camas individuales y muro de piedra"
  },
  {
    id: "la-covacha",
    nombre: "La Covacha",
    tipo: "Familiar · doble + supletoria",
    capacidad: 3,
    precioBaja: 110,
    precioAlta: 145,
    servicios: ["Cama doble + supletoria", "Cuna gratis bajo petición", "Baño privado"],
    descripcion: "La más amplia, pensada para venir con un niño. Cuna gratis si la necesitas.",
    img: null,
    alt: "Habitación familiar La Covacha"
  },
  {
    id: "el-horno",
    nombre: "El Horno",
    tipo: "Individual, la más recogida",
    capacidad: 1,
    precioBaja: 65,
    precioAlta: 85,
    servicios: ["Para una persona", "Baño privado", "Calefacción"],
    descripcion: "Pequeña y recogida, donde estaba el viejo horno. Para quien viaja solo y busca silencio.",
    img: null,
    alt: "Habitación individual El Horno"
  }
];

/* Todas incluyen: baño privado, calefacción, ropa de cama de lino,
   suelo de barro cocido, viga vista y DESAYUNO de la tierra
   (pan de pueblo, aceite de la comarca, huevos del corral). */
window.HABITACIONES_COMUNES =
  "Todas con baño privado, calefacción, ropa de cama de lino y desayuno de la tierra incluido.";
