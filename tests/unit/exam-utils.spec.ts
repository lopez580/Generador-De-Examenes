import { test, expect } from "@playwright/test";
import { calcularPuntaje, obtenerInfoDificultad } from "@/lib/exam-utils";

test.describe("utilidades de examen", () => {
  test("obtenerInfoDificultad devuelve la dificultad más cercana", () => {
    expect(obtenerInfoDificultad(5)).toEqual({ label: "Fácil", tiempo: 20 });
    expect(obtenerInfoDificultad(24)).toEqual({ label: "Intermedia", tiempo: 45 });
    expect(obtenerInfoDificultad(47)).toEqual({ label: "Experto", tiempo: 120 });
  });

  test("calcularPuntaje cuenta aciertos correctamente", () => {
    const preguntas = [
      { respuesta_correcta: "A" },
      { respuesta_correcta: "B" },
      { respuesta_correcta: "C" },
    ];

    const respuestas = {
      0: "A",
      1: "D",
      2: "C",
    };

    expect(calcularPuntaje(preguntas, respuestas)).toBe(2);
  });

  test("calcularPuntaje regresa 0 si no hay respuestas", () => {
    const preguntas = [{ respuesta_correcta: "A" }, { respuesta_correcta: "B" }];
    expect(calcularPuntaje(preguntas, {})).toBe(0);
  });
});
