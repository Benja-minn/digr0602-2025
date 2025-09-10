const width = 1400;
const height = 600;
const margin = { top: 70, right: 50, bottom: 180, left: 70 };

const svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height);

// Cargar JSON local
d3.json("data.json").then(data => {

  data.forEach(d => {
    d.shortTitle = d.Title.length > 15 ? d.Title.slice(0, 15) + "…" : d.Title;
  });

  const x = d3.scaleBand()
    .domain(data.map(d => d.shortTitle))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Rating_IMDB) + 0.5])
    .range([height - margin.bottom, margin.top]);

  // Gradiente por puntaje IMDB
  const colorScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.Rating_IMDB), d3.max(data, d => d.Rating_IMDB)])
    .range(["#a5c4ffff", "#0000f8ff"]); // de morado a verde

  // Dibujar barras
  svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => x(d.shortTitle))
    .attr("y", d => y(d.Rating_IMDB))
    .attr("width", x.bandwidth())
    .attr("height", d => y(0) - y(d.Rating_IMDB))
    .attr("fill", d => colorScale(d.Rating_IMDB))
    .attr("stroke", "#ffffffff")
    .attr("stroke-width", 0.1)
    .attr("ry", 10);

  // Ejes
  const xAxis = d3.axisBottom(x).tickSize(0);
  const yAxis = d3.axisLeft(y);

  // Eje X
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "rotate(-60)")
    .style("text-anchor", "end")
    .attr("fill", "#ffffffff") // color de los labels
    .style("font-size", "12px");

  // Cambiar color de línea del eje X
  svg.select(".x-axis").select(".domain")
    .attr("stroke", "#cacacaff");

  // Eje Y
  svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis)
    .style("font-size", "14px");

  // Cambiar color de línea y ticks del eje Y
  svg.select(".y-axis").select(".domain")
    .attr("stroke", "#ffffffff");
  svg.select(".y-axis").selectAll(".tick line")
    .attr("stroke", "#ffffffff");
  svg.select(".y-axis").selectAll(".tick text")
    .attr("fill", "#ffffffff");

  // Etiquetas
  svg.append("text")
    .attr("x", -height / 2.5)
    .attr("y", 32)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .attr("fill", "#ffffffff")
    .text("IMDB Rating");

// Etiquetas
  svg.append("text")
    .attr("x", height / 2.5)
    .attr("y", 570)
    .attr("text-anchor", "middle")
    .style("font-size", "10px")
    .attr("fill", "#ffffffff")
    .text("*");


  svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .style("font-weight", "bold")
    .attr("fill", "#ffffffff")
    .text("Breaking Bad - Purity level");

});
