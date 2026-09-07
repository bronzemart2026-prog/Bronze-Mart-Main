import React from 'react';

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[];
}

/**
 * Reusable JSON-LD Structured Data Script component for Schema.org
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
