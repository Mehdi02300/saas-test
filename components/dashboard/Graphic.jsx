"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

const Graphic = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    // Données du graphique
    const data = [
      { mois: "Jan", montant: 450 },
      { mois: "Fév", montant: 520 },
      { mois: "Mar", montant: 480 },
      { mois: "Avr", montant: 550 },
      { mois: "Mai", montant: 600 },
      { mois: "Juin", montant: 580 },
    ];

    // Dimensions du graphique
    const margin = { top: 30, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    // Création de l'échelle pour l'axe X (mois)
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.mois))
      .range([0, width])
      .padding(0.1);

    // Création de l'échelle pour l'axe Y (montant)
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.montant)])
      .nice()
      .range([height, 0]);

    // Création de l'élément SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Définition du gradient pour l'aire sous la courbe
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#2563eb")
      .attr("stop-opacity", 0.4);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#3b82f6")
      .attr("stop-opacity", 0.2);

    // Génération de la ligne
    const lineGenerator = d3
      .line()
      .x((d) => xScale(d.mois) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.montant))
      .curve(d3.curveMonotoneX);

    // Ajout de la courbe
    svg
      .append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", lineGenerator)
      .style("fill", "none")
      .style("stroke", "#3b82f6")
      .style("stroke-width", 3)
      .style("stroke-linejoin", "round")
      .style("stroke-linecap", "round")
      .style("opacity", 0.8);

    // Ajout de l'aire sous la courbe
    const areaGenerator = d3
      .area()
      .x((d) => xScale(d.mois) + xScale.bandwidth() / 2)
      .y0(height)
      .y1((d) => yScale(d.montant))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .data([data])
      .attr("class", "area")
      .attr("d", areaGenerator)
      .style("fill", "url(#gradient)");

    // Ajout des axes
    svg
      .append("g")
      .selectAll(".x-axis")
      .data([data])
      .enter()
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .selectAll(".y-axis")
      .data([data])
      .enter()
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale));

    // Ajout d'un tooltip interactif
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.7)")
      .style("color", "#fff")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("visibility", "hidden");

    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.mois) + xScale.bandwidth() / 2)
      .attr("cy", (d) => yScale(d.montant))
      .attr("r", 5)
      .style("fill", "#2563eb")
      .on("mouseover", (event, d) => {
        tooltip
          .style("visibility", "visible")
          .html(`Mois: ${d.mois}<br>Montant: ${d.montant}`)
          .style("top", `${event.pageY + 5}px`)
          .style("left", `${event.pageX + 5}px`);
      })
      .on("mouseout", () => tooltip.style("visibility", "hidden"));
  }, []);

  return (
    <div className="p-5 lg:py-10 bg-n-7 rounded-xl h-[500px]">
      <div className="flex flex-col">
        <h2 className="h4">Évolution des dépenses</h2>
        <p className="body-2 text-n-3">Suivi mensuel de vos dépenses d'abonnement</p>
      </div>
      <div>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default Graphic;
