export interface PreguntaExamen {
  respuesta_correcta: string;
}

export const mapaDificultad: Record<number, { label: string; tiempo: number }> = {
  10: { label: "Fácil", tiempo: 20 },
  20: { label: "Intermedia", tiempo: 45 },
  30: { label: "Difícil", tiempo: 75 },
  40: { label: "Avanzada", tiempo: 90 },
  50: { label: "Experto", tiempo: 120 },
};

export function obtenerInfoDificultad(cantidad: number) {
  const keys = Object.keys(mapaDificultad).map(Number).sort((a, b) => a - b);
  const closest = keys.reduce((prev, current) =>
    Math.abs(current - cantidad) < Math.abs(prev - cantidad) ? current : prev
  );

  return mapaDificultad[closest];
}

export function calcularPuntaje(
  preguntas: PreguntaExamen[],
  respuestas: Record<number, string>
) {
  return preguntas.reduce(
    (acc, pregunta, index) =>
      acc + (respuestas[index] === pregunta.respuesta_correcta ? 1 : 0),
    0
  );
}
