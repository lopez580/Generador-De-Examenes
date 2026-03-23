import { test, expect } from "@playwright/test";
import { calcularPuntaje, obtenerInfoDificultad } from "@/lib/exam-utils";

test.describe("utilidades de examen", () => {

  //pruebas para obtener la dificultas

  test("obtenerInfoDificultad — valor cercano a cada nivel", () => {
    expect(obtenerInfoDificultad(5)).toEqual({ label: "Fácil", tiempo: 20 });
    expect(obtenerInfoDificultad(24)).toEqual({ label: "Intermedia", tiempo: 45 });
    expect(obtenerInfoDificultad(47)).toEqual({ label: "Experto", tiempo: 120 });
  });

  test("obtenerInfoDificultad — valores exactos del mapa", () => {
    expect(obtenerInfoDificultad(10)).toEqual({ label: "Fácil", tiempo: 20 });
    expect(obtenerInfoDificultad(30)).toEqual({ label: "Difícil", tiempo: 75 });
    expect(obtenerInfoDificultad(50)).toEqual({ label: "Experto", tiempo: 120 });
  });

  test("obtenerInfoDificultad — valor menor al mínimo devuelve Fácil", () => {
    expect(obtenerInfoDificultad(1)).toEqual({ label: "Fácil", tiempo: 20 });
  });

  test("obtenerInfoDificultad — valor mayor al máximo devuelve Experto", () => {
    expect(obtenerInfoDificultad(99)).toEqual({ label: "Experto", tiempo: 120 });
  });

  // pruebas para obtenemos el puntaje 

  test("calcularPuntaje — mezcla de correctas e incorrectas", () => {
    const preguntas = [
      { respuesta_correcta: "A" },
      { respuesta_correcta: "B" },
      { respuesta_correcta: "C" },
    ];
    const respuestas = { 0: "A", 1: "D", 2: "C" };

    expect(calcularPuntaje(preguntas, respuestas)).toBe(2);
  });

  test("calcularPuntaje — todas las respuestas correctas", () => {
    const preguntas = [
      { respuesta_correcta: "A" },
      { respuesta_correcta: "B" },
      { respuesta_correcta: "C" },
    ];
    const respuestas = { 0: "A", 1: "B", 2: "C" };

    expect(calcularPuntaje(preguntas, respuestas)).toBe(3);
  });

  test("calcularPuntaje — todas las respuestas incorrectas", () => {
    const preguntas = [
      { respuesta_correcta: "A" },
      { respuesta_correcta: "B" },
    ];
    const respuestas = { 0: "D", 1: "D" };

    expect(calcularPuntaje(preguntas, respuestas)).toBe(0);
  });

  test("calcularPuntaje — sin respuestas devuelve 0", () => {
    const preguntas = [{ respuesta_correcta: "A" }, { respuesta_correcta: "B" }];

    expect(calcularPuntaje(preguntas, {})).toBe(0);
  });

  test("calcularPuntaje — sin preguntas devuelve 0", () => {
    expect(calcularPuntaje([], { 0: "A" })).toBe(0);
  });

});
