"use client";
import React from 'react';

const DataCard = ({cards = []}) => {
    return (
        <div className="section-body mt-4">
            <div className="container-fluid">
                <div className="row clearfix row-deck">
                    {cards.map((card, index) => (
                        <div className="col-lg-3 col-md-6 col-sm-6" key={index}>
                            <div className="card overflow-hidden">
                                <div className="card-body">
                                    <div className="mb-2 h6">{card.title}</div>
                                    <div>
                    <span className="h4 font700">
                      {card.value} {card.unit && card.unit}
                    </span>{" "}
                                        <span
                                            className={`small ${card.trend === "up" ? "text-success" : "text-danger"}`}>
                      <i className={`fa ${card.trend === "up" ? "fa-level-up" : "fa-level-down"}`}></i> {card.percentChange}%
                    </span>
                                    </div>
                                    <small className="text-muted">{card.subtitle}</small>
                                </div>
                                <div className="progress" style={{height: "4px"}}>
                                    <div
                                        className={`progress-bar ${card.trend === "up" ? "bg-success" : "bg-danger"}`}
                                        role="progressbar"
                                        style={{width: card.progress}}
                                        aria-valuenow={parseInt(card.progress, 10)}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DataCard;
