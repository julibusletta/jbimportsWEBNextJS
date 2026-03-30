'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCreditCard, FaRegCreditCard, FaTruck } from 'react-icons/fa';
import '../../styles/PromoBanners.css';

const PromoBanners = () => {
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await fetch('/api/home-settings');
                const data = await res.json();
                if (data.weeklyOffers && data.weeklyOffers.length > 0) {
                    setOffers(data.weeklyOffers.filter((o: any) => o.active));
                } else {
                    // Fallback
                    setOffers([
                        { productId: "378", title: "JBL CHARGE 6", subtitle: "* 10% de descuento abonando por transferencia", link: "/product/378", type: 'jbl' },
                        { productId: "1339", title: "XIAOMI SMART", subtitle: "ROBOT S40C", link: "/product/1339", type: 'xiaomi' }
                    ]);
                }
            } catch (err) {
                console.error('Error fetching weekly offers:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    if (loading) return null;
    if (offers.length === 0) return null;

    return (
        <section className="promo-banners-section mb-12 px-4" style={{ paddingTop: '10px' }}>
            <div className="w-full bg-[#e2e6eb] rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-[#d1d5db]" style={{ maxWidth: '1480px', margin: '0 auto', paddingTop: '48px', paddingBottom: '48px' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>
                    <div className="mb-6 flex justify-start items-center">
                        <h2 className="main-section-title">
                            Ofertas <b className="text-[#0066cc]">semanales</b>
                        </h2>
                    </div>
                </div>
                <div className="promo-banners-container" style={{ padding: '0 16px', maxWidth: '1400px', margin: '0 auto' }}>
                    {offers.map((offer, idx) => {
                        const isFirst = idx === 0;
                        const cardClass = isFirst ? 'tb-card tb-jbl' : 'tb-card tb-xiaomi';
                        const linkHref = offer.link || `/product/${offer.productId}`;

                        return (
                            <Link key={idx} href={linkHref} className={cardClass}>
                                {isFirst ? (
                                    <>
                                        <div className="tb-image-col"></div>
                                        <div className="tb-text-col tb-text-light">
                                            <h2 className="tb-title -mb-1 lowercase">{offer.title}</h2>
                                            <div className="text-3xl md:text-4xl font-black text-white uppercase italic">OFERTA</div>
                                            <div className="text-[11px] font-bold text-slate-300 md:mb-5">
                                                {offer.subtitle}
                                            </div>
                                            <div className="tb-features">
                                                <div className="tb-feature">
                                                    <div className="tb-icon-wrapper"><FaCreditCard /></div>
                                                    <div className="tb-feature-text">
                                                        <strong>HASTA 6 CUOTAS</strong>
                                                        <span>SIN INTERÉS</span>
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
                                    </>
                                ) : (
                                    <>
                                        <div className="tb-text-col tb-text-left tb-text-dark">
                                            <h2 className="tb-title">{offer.title}</h2>
                                            <div className="tb-subtitle">
                                                <strong className="uppercase">{offer.subtitle}</strong>
                                            </div>
                                            <div className="tb-features-row">
                                                <div className="tb-feature-horizontal">
                                                    <div className="tb-icon-circle"><FaCreditCard /></div>
                                                    <div className="tb-feature-text">
                                                        <strong>HASTA 6 CUOTAS</strong>
                                                        <span>SIN INTERÉS</span>
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
                                        <div className="tb-image-col"></div>
                                    </>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PromoBanners;
