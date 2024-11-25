import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const Graphic = () => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: 0 });

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "subscriptions"));
        const monthlyTotalsSnapshot = await getDocs(collection(db, "monthlyTotals"));

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthNames = [
          "Jan",
          "Fév",
          "Mar",
          "Avr",
          "Mai",
          "Juin",
          "Juil",
          "Août",
          "Sept",
          "Oct",
          "Nov",
          "Déc",
        ];

        // Créer un tableau pour les 5 derniers mois avec des montants à 0
        const lastFiveMonths = Array.from({ length: 5 }, (_, i) => {
          const date = new Date(currentYear, currentMonth - 4 + i);
          return { mois: monthNames[date.getMonth()], montant: 0 };
        });

        // Récupérer les montants des mois précédents depuis Firebase
        const monthlyTotals = {};
        monthlyTotalsSnapshot.forEach((doc) => {
          const dataDoc = doc.data();
          const month = dataDoc.month; // Mois dans Firebase (1-12)
          const totalAmount = dataDoc.totalAmount || 0; // Montant
          if (month !== undefined && totalAmount !== undefined) {
            monthlyTotals[month] = totalAmount;
          }
        });

        // Associer les montants de monthlyTotals aux mois dans lastFiveMonths pour les mois passés
        lastFiveMonths.forEach((monthData, index) => {
          const monthIndex = monthNames.indexOf(monthData.mois);
          const firebaseMonth = monthIndex + 1; // Mois dans Firebase (1-12)
          if (index < 4) {
            // Pour les mois précédents (pas le mois actuel)
            const montantFirebase = monthlyTotals[firebaseMonth] || 0;
            monthData.montant = montantFirebase; // Assure que si aucune donnée, mettre 0
          }
        });

        setData(lastFiveMonths);

        // Traitement des abonnements uniquement pour le mois en cours
        if (lastFiveMonths[4]) {
          querySnapshot.forEach((doc) => {
            const subscription = doc.data();
            const dueDate = subscription.dueDate?.seconds * 1000; // Convertir le timestamp
            const amount = subscription.cost || 0;
            const frequency = subscription.frequency;
            const serviceName = subscription.serviceName || "Nom Inconnu";

            const currentDate = new Date();
            const isActive = dueDate && new Date(dueDate) > currentDate;

            if (dueDate && isActive) {
              const date = new Date(dueDate);
              const month = date.getMonth();
              const year = date.getFullYear();

              if (frequency === "monthly" && year === currentYear && month === currentMonth) {
                lastFiveMonths[4].montant += amount;
              }

              if (frequency === "yearly") {
                lastFiveMonths[4].montant += amount / 12; // Répartition sur les 12 mois
              }
            }
          });
        }

        setData(lastFiveMonths);
      } catch (error) {
        console.error("Erreur lors de la récupération des abonnements:", error);
      }
    };

    fetchSubscriptions();
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const margin = { top: 30, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const xScale = d3
      .scalePoint()
      .domain(data.map((d) => d.mois))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.montant)])
      .nice()
      .range([height, 0]);

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "100%")
      .attr("y2", "0%")
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#5C6BC0")
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#EF6C00");

    const lineGenerator = d3
      .line()
      .x((d) => xScale(d.mois))
      .y((d) => yScale(d.montant))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", lineGenerator)
      .style("fill", "none")
      .style("stroke", "#2563eb")
      .style("stroke-width", 2);

    const areaGenerator = d3
      .area()
      .x((d) => xScale(d.mois))
      .y0(height)
      .y1((d) => yScale(d.montant))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", areaGenerator)
      .style("fill", "url(#gradient)");

    svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(xScale));
    svg.append("g").call(d3.axisLeft(yScale));

    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.mois))
      .attr("cy", (d) => yScale(d.montant))
      .attr("r", 5)
      .style("fill", "#2563eb")
      .on("mouseover", (event, d) => {
        const { clientX, clientY } = event;
        setTooltip({
          visible: true,
          x: clientX,
          y: clientY,
          value: d.montant,
        });
      })
      .on("mouseout", () => {
        setTooltip({ visible: false, x: 0, y: 0, value: 0 });
      });
  }, [data]);

  const adjustTooltipPosition = (x, y) => {
    const tooltipWidth = 150;
    const tooltipHeight = 40;
    const maxX = window.innerWidth - tooltipWidth - 20; // Limite droite
    const maxY = window.innerHeight - tooltipHeight - 20; // Limite bas

    // Empêcher le tooltip de sortir à droite et en bas
    const adjustedX = x > maxX ? maxX : x + 10;
    const adjustedY = y > maxY ? maxY : y + 10;

    return { x: adjustedX, y: adjustedY };
  };

  return (
    <div className="p-5 lg:py-10 bg-n-7 rounded-xl h-[500px] relative">
      <h2 className="text-2xl text-white text-center font-semibold mb-6">Suivi des abonnements</h2>
      <svg ref={svgRef}></svg>
      {tooltip.visible && (
        <div
          className="bg-black text-white p-2 rounded"
          style={{
            top: adjustTooltipPosition(tooltip.x, tooltip.y).y,
            left: adjustTooltipPosition(tooltip.x, tooltip.y).x,
            pointerEvents: "none",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {tooltip.value} €
        </div>
      )}
    </div>
  );
};

export default Graphic;
