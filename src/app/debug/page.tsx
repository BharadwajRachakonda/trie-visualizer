"use client";
import { useState, useEffect } from "react";
import * as d3 from "d3";
import { animate } from "motion";

interface TrieNode {
  [key: string]: TrieNode | number;
}

interface ExtendedHierarchyNode extends d3.HierarchyNode<any> {
  x0?: number;
  y0?: number;
  _children?: ExtendedHierarchyNode[];
}

const Page = () => {
  const [dictionary, setDictionary] = useState<TrieNode>({});

  const convertToHierarchy = (obj: TrieNode | number, name = "root"): any => {
    if (typeof obj === "number") {
      return { name, value: obj, children: [] };
    }

    const children: any[] = [];

    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === "number") {
        children.push({
          name: `${key}: ${value}`,
          value,
          children: [],
        });
      } else {
        children.push(convertToHierarchy(value, key));
      }
    });

    return { name, children };
  };

  useEffect(() => {
    if (Object.keys(dictionary).length === 0) return;

    const hierarchyData = convertToHierarchy(dictionary);
    const root = d3.hierarchy(hierarchyData) as ExtendedHierarchyNode;

    const nodeWidth = 140;
    const nodeHeight = 100;

    const maxDepth = Math.max(...root.descendants().map((d) => d.depth));
    const leafCount = root.leaves().length;

    const width = Math.max(leafCount * nodeWidth, 800);
    const height = Math.max((maxDepth + 1) * nodeHeight, 600);

    const margin = { top: 20, right: 40, bottom: 20, left: 40 };

    d3.select("#tree-container").selectAll("*").remove();

    const container = d3
      .select("#tree-container")
      .append("div")
      .attr("class", "svg-wrapper")
      .style("width", "100vw")
      .style("height", "100vh")
      .style("overflow", "hidden");

    const svg = container
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left + 30}, ${margin.top})`);

    svg.append("defs").append("style").text(`
      .node circle {
        fill: #000;
        stroke: #fff;
        stroke-width: 1px;
        cursor: pointer;
      }
      .node circle.has-children {
        fill: #fff;
      }
      .node text {
        font: 20px sans-serif;
        cursor: pointer;
        fill: #fff;
      }
      .link {
        fill: #fff;
        stroke: #ccc;
        stroke-width: 2px;
      }
      .tooltip {
        position: absolute;
        text-align: center;
        padding: 8px;
        font: 12px sans-serif;
        background: rgba(0, 0, 0, 0.8);
        border-radius: 8px;
        pointer-events: none;
        opacity: 0;
      }
      .svg-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
      }
    `);

    const tooltip = d3
      .select("body")
      .selectAll(".trie-tooltip")
      .data([0])
      .enter()
      .append("div")
      .attr("class", "tooltip trie-tooltip");

    const tree = d3.tree<ExtendedHierarchyNode>().size([height, width]);

    root.x0 = height / 2;
    root.y0 = 0;

    let i = 0;

    function update(source: ExtendedHierarchyNode) {
      const treeRoot = tree(root);
      const nodes = treeRoot.descendants() as ExtendedHierarchyNode[];
      const links = nodes.slice(1);
      nodes.forEach((d) => (d.y = d.depth * 180));

      const node = g
        .selectAll<SVGGElement, ExtendedHierarchyNode>(".node")
        .data(nodes, (d: any) => d.id || (d.id = ++i));

      const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", () => `translate(${source.y0},${source.x0})`)
        .on("click", click)
        .on("mouseover", (event: any, d) => {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(
              `<strong>${d.data.name}</strong><br/>Click to ${
                d.children ? "collapse" : "expand"
              }`
            )
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () =>
          tooltip.transition().duration(500).style("opacity", 0)
        );

      nodeEnter
        .append("circle")
        .attr("r", 1e-6)
        .attr("class", (d) => (d._children ? "has-children" : ""));

      nodeEnter
        .append("text")
        .attr("dy", ".8em")
        .attr("x", (d) => (d.children || d._children ? -13 : 13))
        .attr("text-anchor", (d) =>
          d.children || d._children ? "end" : "start"
        )
        .text((d) => d.data.name)
        .style("fill-opacity", 1e-6);

      const nodeUpdate = nodeEnter.merge(node as any);
      nodeUpdate
        .transition()
        .duration(750)
        .attr("transform", (d) => `translate(${d.y},${d.x})`);

      nodeUpdate
        .select("circle")
        .transition()
        .duration(750)
        .attr("r", 8)
        .attr("class", (d) => (d._children ? "has-children" : ""));

      nodeUpdate
        .select("text")
        .transition()
        .duration(750)
        .style("fill-opacity", 1)
        .attr("x", (d) => (d.children || d._children ? -15 : 15))
        .attr("text-anchor", (d) =>
          d.children || d._children ? "end" : "start"
        );

      const nodeExit = node
        .exit()
        .transition()
        .duration(750)
        .attr("transform", () => `translate(${source.y},${source.x})`)
        .remove();

      nodeExit.select("circle").attr("r", 1e-6);
      nodeExit.select("text").style("fill-opacity", 1e-6);

      const link = g.selectAll("path.link").data(links, (d: any) => d.id);

      const linkEnter = link
        .enter()
        .insert("path", "g")
        .attr("class", "link")
        .attr("d", () => diagonal(root, root));

      linkEnter
        .merge(link as any)
        .transition()
        .duration(750)
        .attr("d", (d) => diagonal(d, d.parent!));

      link
        .exit()
        .transition()
        .duration(750)
        .attr("d", () => diagonal(source, source))
        .remove();

      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    function diagonal(s: ExtendedHierarchyNode, d: ExtendedHierarchyNode) {
      return `M ${s.y} ${s.x} L ${d.y} ${d.x}`;
    }

    function click(event: any, d: ExtendedHierarchyNode) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = undefined;
      }
      update(d);
    }

    update(root);
  }, [dictionary]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          animate(".input", { y: 0 }, { delay: 0.3, duration: 0.2 });

          const input = e.target.dictionary.value.trim();
          if (input === "") {
            console.error("Input cannot be empty");
            return;
          }

          try {
            const fixed = input.replaceAll("'", '"');
            const parsed = JSON.parse(fixed);
            setDictionary(parsed);
          } catch (error) {
            console.error("Invalid JSON format:", error);
          }
        }}
      >
        <div className="flex flex-row items-center justify-center input z-50 drop-shadow-2xl drop-shadow-gray-950">
          <input
            type="text"
            name="dictionary"
            className="border-2 rounded-4xl my-5 m-2 p-2 bg-black text-white placeholder-gray-400"
            placeholder='{"a":{"end":1}, "b":{"end":1}}'
            onFocus={() => animate(".input", { y: "50svh" }, { duration: 0.2 })}
            onBlur={() =>
              animate(".input", { y: 0 }, { delay: 0.3, duration: 0.2 })
            }
            required
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            className="rounded-4xl border-2 border-white hover:bg-gray-100 bg-black text-white hover:text-black transition-all duration-300 px-4 py-2 font-semibold m-2 cursor-pointer"
          >
            enter
          </button>
        </div>
      </form>
      <br />
      <div id="tree-container"></div>
    </div>
  );
};

export default Page;
