import React, { createRef, Component } from "react";
import * as d3 from "d3";
import Tooltip from "./Tooltip";
class PieClass extends Component {
  constructor(props) {
    super(props);
    this.ref = createRef();
    this.createPie = d3
      .pie()
      .value(d => d.value)
      .sort(null);
    this.createArc = d3.arc();
    this.colors = d3.scaleOrdinal(d3.schemeCategory10);
    this.format = d3.format(".2f");
    this.state = {
      hover: false
    };
  }
  setHover(hX) {
    this.setState({
      hover: hX
    });
  }
  setCordsX(cordsX) {
    this.setState({
      left: cordsX
    });
  }
  setCordsY(cordsY) {
    this.setState({
      top: cordsY
    });
  }
  componentDidMount() {
    const svg = d3.select(this.ref.current);
    const data = this.createPie(this.props.data);
    const { width, height } = this.props;
    svg
      .attr("class", "chart")
      .attr("width", width)
      .attr("height", height);

    const group = svg.append("g").attr("transform", `translate(90 90)`);
    const groupWithEnter = group
      .selectAll("g.arc")
      .data(data)
      .enter();
    const path = groupWithEnter.append("g").attr("class", "arc");
    path
      .append("path")
      .attr("class", "arc")
      .attr("d", this.createArc)
      .on("mousemove", e => {
        this.setHover(e.value);
        this.setCordsX(d3.event.pageX);
        this.setCordsY(d3.event.pageY);
      })
      .on("mouseleave", d => {
        setTimeout(() => this.setHover(null), 100);
      });
  }

  componentWillUpdate(nextProps, nextState) {
    const svg = d3.select(this.ref.current);
    const data = this.createPie(nextProps.data);
    let radius = Math.min(this.props.width, this.props.height) / 2;
    var circumferenceOfCircle = radius * Math.PI * 2;
    const arcLength = circumferenceOfCircle / data.length;
    //var arcs = d3.range(0, Math.floor(circumferenceOfCircle / arcLength));
    var arcDegrees = (arcLength / circumferenceOfCircle) * (Math.PI * 2);
    const group = svg
      .select("g")
      .selectAll("g.arc")
      .data(data);
    group.exit().remove();
    const groupWithUpdate = group
      .enter()
      .append("g")
      .attr("class", "arc");

    let inner = 0.2 * radius;
    let i = 0;
    var tempEndAngle;
    let j = 0;
    var tempEndAngle1;
    this.createArc = d3
      .arc()
      .innerRadius(inner)
      .outerRadius(function (d) {
        return (radius - inner) * (d.data.value / 100) + inner;
      })
      .startAngle(function () {
        var startAngle = 0;
        var endAngle = 0;
        if (i === 0) {
          startAngle = 0;
          endAngle = startAngle + arcDegrees;
        } else {
          startAngle = tempEndAngle;
          endAngle = startAngle + arcDegrees;
        }
        i++;
        tempEndAngle = endAngle;
        return startAngle;
      })
      .endAngle(function () {
        var startAngle = 0;
        var endAngle = 0;
        if (j === 0) {
          startAngle = 0;
          endAngle = startAngle + arcDegrees;
        } else {
          startAngle = tempEndAngle1;
          endAngle = startAngle + arcDegrees;
        }
        j++;
        tempEndAngle1 = endAngle;
        return endAngle;
      });

    const path = groupWithUpdate
      .enter()
      .append("path")
      .merge(group.select("path.arc"));

    path
      .attr("class", "arc")
      .attr("d", this.createArc)
      .attr("d", this.createArc.cornerRadius(6))
      .attr("fill", (d, i) => this.colors(i))
      .attr("fill-opacity", "0.7")
      .attr("stroke", (d, i) => this.colors(i))
      .attr("stroke-width", "1");
    let outlineArc = d3
      .arc()
      .innerRadius(inner)
      .outerRadius(function (d) {
        return radius;
      })
      .startAngle(function () {
        var startAngle = 0;
        var endAngle = 0;
        if (i === 0) {
          startAngle = 0;
          endAngle = startAngle + arcDegrees;
        } else {
          startAngle = tempEndAngle;
          endAngle = startAngle + arcDegrees;
        }
        i++;
        tempEndAngle = endAngle;
        return startAngle;
      })
      .endAngle(function () {
        var startAngle = 0;
        var endAngle = 0;
        if (j === 0) {
          startAngle = 0;
          endAngle = startAngle + arcDegrees;
        } else {
          startAngle = tempEndAngle1;
          endAngle = startAngle + arcDegrees;
        }
        j++;
        tempEndAngle1 = endAngle;
        return endAngle;
      });
    svg
      .selectAll(".outlineArc")
      .data(data)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("class", "outlineArc")
      .attr("d", outlineArc)
      .style("stroke-dasharray", "1, 4")
      .attr("transform", `translate(90 90)`);

    const text = groupWithUpdate.append("text").merge(group.select("text"));

    text
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("transform", d => `translate(${this.createArc.centroid(d)})`)
      .text(d => d.value);
  }

  render() {
    return (
      <div>
        <svg ref={this.ref} />
        {this.state.hover && <Tooltip prop={this.state} />}
      </div>
    );
  }
}

export default PieClass;
