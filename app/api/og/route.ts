import { ImageResponse } from 'next/og';
import React from 'react';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const title = searchParams.get('title') || 'Nhà Phố Sài Gòn';
        const price = searchParams.get('price') || '';
        const area = searchParams.get('area') || '';

        return new ImageResponse(
            React.createElement(
                'div',
                {
                    style: {
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#ffffff',
                        padding: '40px',
                    },
                },
                React.createElement(
                    'div',
                    {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '4px solid #000000',
                            padding: '60px 80px',
                            maxWidth: '90%',
                            backgroundColor: '#ffffff',
                        },
                    },
                    React.createElement(
                        'h1',
                        {
                            style: {
                                fontSize: '48px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                marginBottom: '20px',
                                color: '#000000',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                lineHeight: 1.2,
                                maxWidth: '800px',
                            },
                        },
                        title
                    ),
                    price && React.createElement(
                        'p',
                        {
                            style: {
                                fontSize: '36px',
                                color: '#333333',
                                margin: '10px 0',
                                fontWeight: '600',
                            },
                        },
                        price
                    ),
                    area && React.createElement(
                        'p',
                        {
                            style: {
                                fontSize: '24px',
                                color: '#666666',
                                margin: '10px 0',
                            },
                        },
                        `Diện tích: ${area} m²`
                    ),
                    React.createElement(
                        'div',
                        {
                            style: {
                                marginTop: '30px',
                                paddingTop: '20px',
                                borderTop: '2px solid #e5e5e5',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            },
                        },
                        React.createElement(
                            'p',
                            {
                                style: {
                                    fontSize: '18px',
                                    color: '#999999',
                                    textTransform: 'uppercase',
                                    letterSpacing: '4px',
                                    margin: 0,
                                },
                            },
                            'Nhà Phố Sài Gòn'
                        ),
                        React.createElement(
                            'p',
                            {
                                style: {
                                    fontSize: '12px',
                                    color: '#cccccc',
                                    marginTop: '8px',
                                    letterSpacing: '2px',
                                },
                            },
                            'nhaphosaigon.com'
                        )
                    )
                )
            ),
            {
                width: 1200,
                height: 630,
                headers: {
                    'Cache-Control': 'public, max-age=86400, immutable',
                },
            }
        );
    } catch (error) {
        console.error('Error generating OG image:', error);
        return new Response('Failed to generate image', { status: 500 });
    }
}