import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ title, description, keywords, ogTitle, ogDescription, ogImage }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={ogDescription} />
            <meta property="og:image" content={ogImage} />
        </Helmet>
    );
};

// Default props (optional)
SEO.defaultProps = {
    title: 'Meadows Hotel & Suites',
    description: 'Welcome to The Meadows Hotel & Suites. Experience the best in luxury accommodations, facilities, and services.',
    keywords: 'Meadows Hotel & Suites, best hotel, 5-star hotel',
    ogTitle: 'The Meadows Hotel & Suites',
    ogDescription: 'Welcome to Meadows Hotel & Suites. Experience the best in luxury accommodations, facilities, and services.',
};

export default SEO;