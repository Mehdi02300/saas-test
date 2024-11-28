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
  const margin = { top: 20, right: 40, bottom: 120, left: 45 };
  const width = (isLargeScreen ? 430 : 310) - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  useEffect(() => {
    const fetchData = async (userId) => {
      try {
        const expenses = await getExpensesHistory(userId);
        setData(expenses.sort((a, b) => new Date(a.date) - new Date(b.date)));
      } catch (error) {
        setData([]);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) fetchData(user.uid);
    });

    return () => unsubscribe();
  }, []);

  const filteredData = data.slice(-1 * 5);

  useEffect(() => {
    if (filteredData.length === 0) return;

    d3.select(svgRef.current).selectAll("*").remove();

    // Setup SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scalePoint()
      .domain(filteredData.map((d) => d.mois))
      .range([0, width])
      .padding(0);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData, (d) => d.montant)])
      .nice()
      .range([height, 0]);

    // Gradient
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#5C6BC0");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#EF6C00");

    // Line
    const line = d3
      .line()
      .x((d) => xScale(d.mois))
      .y((d) => yScale(d.montant))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(filteredData)
      .attr("class", "line")
      .attr("d", line)
      .style("fill", "none")
      .style("stroke", "#2563eb")
      .style("stroke-width", 2);

    // Area
    const area = d3
      .area()
      .x((d) => xScale(d.mois))
      .y0(height)
      .y1((d) => yScale(d.montant))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(filteredData)
      .attr("class", "area")
      .attr("d", area)
      .style("fill", "url(#gradient)");

    // Axes
    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));

    svg.append("g").call(d3.axisLeft(yScale));

    // Interactive dots
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
      .on("mouseout", () => setTooltip({ visible: false, svgX: 0, svgY: 0, value: 0 }));

    // Tooltip
    if (tooltip.visible) {
      const tooltipGroup = svg
        .append("g")
        .attr("class", "tooltip")
        .attr("transform", `translate(${tooltip.svgX},${tooltip.svgY})`);

      const text = tooltipGroup
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-10")
        .attr("fill", "white")
        .style("font-size", "12px")
        .text(`${tooltip.value.toFixed(2)} €`);

      const bbox = text.node().getBBox();
      const padding = 4;

      tooltipGroup
        .insert("rect", "text")
        .attr("x", bbox.x - padding)
        .attr("y", bbox.y - padding)
        .attr("width", bbox.width + padding * 2)
        .attr("height", bbox.height + padding * 2)
        .attr("fill", "black")
        .attr("rx", 4);
    }
  }, [filteredData, tooltip, width, height, margin]);

  if (!data?.length || data.every((d) => d.montant === 0)) {
    return (
      <div className="p-5 bg-n-7 rounded-xl h-[400px] flex flex-col items-center justify-start">
        <h2 className="h4 text-center mb-5">Évolution des dépenses mensuelles</h2>
        <p className="text-white">Aucun abonnement trouvé.</p>
      </div>
    );
  }

  return (
    <div className="pr-5 py-5 bg-n-7 rounded-xl w-full h-[400px] relative flex flex-col items-center justify-center">
      <h2 className="h4 text-center">Évolution des dépenses mensuelles</h2>
      <svg ref={svgRef} className="max-w-full"></svg>
    </div>
  );
};

export default Graphic;
