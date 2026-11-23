import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = "3-Politexnikum Talabalar Boshqaruv Portali - Dars jadvali, baholar, davomat va amaliyot vazifalari.",
  keywords = "3-Politexnikum, talabalar portali, dars jadvali, baholar, davomat, reyting, student hub",
  canonical,
}) => {
  const fullTitle = `${title} | 3-Politexnikum`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};
