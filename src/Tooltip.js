import React, { Component } from "react";

class Tooltip extends Component {
    render() {
        let left = this.props.prop.left;
        let top = this.props.prop.top;
        return (
            <div>
                <span
                    style={{
                        padding: ".7% 1%",
                        background: "rgba(255, 255, 255, 0.75)",
                        left: left - 5,
                        top: top - 33,
                        position: "absolute",
                        border: "1px solid lightgray",
                        borderRadius: "5%",
                        fontSize: "13px",
                        pointerEvents: "none"
                    }}
                    className="tooltip"
                >
                    {this.props.prop.hover}
                </span>
            </div>
        );
    }
}
export default Tooltip;
