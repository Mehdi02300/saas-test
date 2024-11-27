"use client";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getExpensesHistory } from "@/actions/getSubs.action";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useBreakpoint } from "@/hooks/useBreakpoint";

const Graphic = () => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [tooltip, setTooltip] = useState({
    visible: false,
    svgX: 0,
    svgY: 0,
    value: 0,
  });

  const isLargeScreen = useBreakpoint();

  useEffect(() => {
    const fetchData = async (userId) => {
      try {
        const expenses = await getExpensesHistory(userId);
        console.log("Données récupérées:", expenses);

        const sortedData = expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
        setData(sortedData);
      } catch (error) {
        console.log("Erreur récupération données:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Ajustement des données pour inclure toujours le mois en cours et les mois les plus récents
  const currentMonth = new Date().toLocaleString("fr-FR", { month: "long" });
  const filteredData = data.slice(-1 * (isLargeScreen ? 5 : 3));

  useEffect(() => {
    if (filteredData.length === 0) return;
    console.log("Données pour le graphique:", filteredData);

    const margin = { top: 30, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Configuration des échelles
    const xScale = d3
      .scalePoint()
      .domain(filteredData.map((d) => d.mois))
      .range([0, 300])
      .padding(1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData, (d) => d.montant)])
      .nice()
      .range([height, 0]);

    // Ajout du dégradé
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%"); // Ajuste pour un dégradé vertical
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#5C6BC0");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#EF6C00");

    // Générateur de lignes
    const lineGenerator = d3
      .line()
      .x((d) => xScale(d.mois))
      .y((d) => yScale(d.montant))
      .curve(d3.curveMonotoneX);

    // Ligne du graphique
    svg
      .append("path")
      .datum(filteredData)
      .attr("class", "line")
      .attr("d", lineGenerator)
      .style("fill", "none")
      .style("stroke", "#2563eb")
      .style("stroke-width", 2);

    // Générateur d'aire
    const areaGenerator = d3
      .area()
      .x((d) => xScale(d.mois))
      .y0(height)
      .y1((d) => yScale(d.montant))
      .curve(d3.curveMonotoneX);

    // Aire du graphique
    svg
      .append("path")
      .datum(filteredData)
      .attr("class", "area")
      .attr("d", areaGenerator)
      .style("fill", "url(#gradient)");

    // Axes
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));

    svg.append("g").call(d3.axisLeft(yScale));

    // Points interactifs
    svg
      .selectAll(".dot")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.mois))
      .attr("cy", (d) => yScale(d.montant))
      .attr("r", 5)
      .style("fill", "#2563eb")
      .on("mouseover", (event, d) => {
        setTooltip({
          visible: true,
          svgX: xScale(d.mois),
          svgY: yScale(d.montant),
          value: d.montant,
        });
      })
      .on("mouseout", () => {
        setTooltip({ visible: false, svgX: 0, svgY: 0, value: 0 });
      });

    // Tooltip dans le SVG
    if (tooltip.visible) {
      svg
        .append("g")
        .attr("class", "tooltip")
        .attr("transform", `translate(${tooltip.svgX},${tooltip.svgY})`)
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-10")
        .attr("fill", "white")
        .style("font-size", "12px")
        .text(`${tooltip.value.toFixed(2)} €`)
        .each(function () {
          // Ajouter un rectangle de fond
          const bbox = this.getBBox();
          const padding = 4;

          d3.select(this.parentNode)
            .insert("rect", "text")
            .attr("x", bbox.x - padding)
            .attr("y", bbox.y - padding)
            .attr("width", bbox.width + padding * 2)
            .attr("height", bbox.height + padding * 2)
            .attr("fill", "black")
            .attr("rx", 4);
        });
    }
  }, [filteredData, tooltip]); // Dépendance à filteredData et tooltip

  if (data.length === 0) {
    return (
      <div className="p-5 lg:py-10 bg-n-7 rounded-xl h-[500px] flex items-center justify-center">
        <p className="text-white">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="pr-5 py-5 lg:py-10 bg-n-7 rounded-xl w-full h-[500px] relative flex flex-col items-center justify-center">
      <h2 className="text-2xl text-white text-center font-semibold mb-6">
        Évolution des dépenses mensuelles
      </h2>
      <svg ref={svgRef} className="max-w-full lg:pl-9"></svg>
    </div>
  );
};

export default Graphic;
