'use client';

import React from 'react';
import Link from 'next/link';
import { FaCreditCard, FaRegCreditCard, FaTruck } from 'react-icons/fa';
import '../../styles/PromoBanners.css';

const PromoBanners = () => {
    return (
        <section className="promo-banners-section">
            <div className="promo-banners-container">
                {/* Banner 1: JBL */}
                <Link href="/category/parlantes" className="tb-card tb-jbl">
                    <div className="tb-image-col">
                        {/* Background handles the image */}
                    </div>
                    <div className="tb-text-col tb-text-light">
                        <h2 className="tb-title">PARLANTES JBL</h2>
                        <div className="tb-features">
                            <div className="tb-feature">
                                <div className="tb-icon-wrapper"><FaCreditCard /></div>
                                <div className="tb-feature-text">
                                    <strong>6 CUOTAS S/I</strong>
                                    <span>CON CRÉDITO</span>
                                </div>
                            </div>
                            <div className="tb-feature">
                                <div className="tb-icon-wrapper"><FaRegCreditCard /></div>
                                <div className="tb-feature-text">
                                    <strong>4 CUOTAS S/I</strong>
                                    <span>CON DÉBITO</span>
                                </div>
                            </div>
                            <div className="tb-feature">
                                <div className="tb-icon-wrapper"><FaTruck /></div>
                                <div className="tb-feature-text">
                                    <strong>ENVÍOS A</strong>
                                    <span>TODO EL PAÍS</span>
                                </div>
                            </div>
                        </div>
                        <div className="tb-btn">COMPRAR</div>
                    </div>
                </Link>

                {/* Banner 2: Xiaomi */}
                <Link href="/category/notebooks" className="tb-card tb-xiaomi">
                    <div className="tb-text-col tb-text-left tb-text-dark">
                        <h2 className="tb-title">XIAOMI SMART</h2>
                        <div className="tb-subtitle">
                            <strong>ROBOT S40C</strong> <span></span>
                        </div>
                        <div className="tb-features-row">
                            <div className="tb-feature-horizontal">
                                <div className="tb-icon-circle"><FaCreditCard /></div>
                                <div className="tb-feature-text">
                                    <strong>6 CUOTAS S/I</strong>
                                    <span>CON CRÉDITO</span>
                                </div>
                            </div>
                            <div className="tb-divider"></div>
                            <div className="tb-feature-horizontal">
                                <div className="tb-icon-circle"><FaTruck /></div>
                                <div className="tb-feature-text">
                                    <strong>ENVÍOS GRATIS</strong>
                                    <span>TODO EL PAÍS</span>
                                </div>
                            </div>
                        </div>
                        <div className="tb-btn tb-btn-green">COMPRAR</div>
                    </div>
                    <div className="tb-image-col">
                        {/* Background handles the image */}
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default PromoBanners;
