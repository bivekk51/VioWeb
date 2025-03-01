import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        // Simpler scroll animation
        const handleScroll = () => {
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const isInViewport = rect.top <= window.innerHeight * 0.75;

                if (isInViewport) {
                    section.style.opacity = "1";
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check for sections already in viewport
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen font-sans text-gray-800 bg-gray-50">
           
            <section className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-blue-900 relative overflow-hidden pt-16 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                 
                    <div className="grid grid-cols-8 gap-4 w-full h-full">
                        {Array(64).fill().map((_, i) => (
                            <div key={i} className="relative">
                                <div className={`absolute ${i % 2 === 0 ? 'bg-blue-400' : 'bg-red-400'} opacity-30 rounded-full w-2 h-2 animate-pulse`}
                                    style={{
                                        left: `${(i % 8) * 12.5}%`,
                                        top: `${Math.floor(i / 8) * 12.5}%`,
                                        animationDelay: `${i % 5 * 0.5}s`
                                    }}>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className={`transform transition-transform duration-1000 ${isVisible ? 'translate-y-0' : 'translate-y-10'}`}>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            AI-Powered Violence Detection System
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
                            Enhancing security through real-time AI-driven analysis of video feeds.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300">
                               <Link to="/videorecorder">Get Started</Link> 
                            </button>
                            <button
                                onClick={() => scrollToSection('overview')}
                                className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-900 transform hover:scale-105 transition duration-300"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Overview Section */}
            <section id="overview" className="py-20 bg-white opacity-0 transition-opacity duration-700" style={{ transitionDelay: "200ms" }}>
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Overview</h2>
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="md:w-1/2">
                            <p className="text-lg text-gray-700 mb-6">
                                Our AI model analyzes videos to detect violent activities in real-time, ensuring safety in schools, public spaces, and events.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    { title: 'AI-powered violence detection', desc: 'Advanced neural networks trained to recognize patterns of violence' },
                                    { title: 'Real-time alerts', desc: 'Immediate notifications when violent activity is detected' },
                                    { title: 'High accuracy & efficiency', desc: '98.7% accuracy with minimal false positives' },
                                    { title: 'Easy integration', desc: 'Seamlessly connects with existing security systems' }
                                ].map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                            <span className="text-blue-600 text-sm">✓</span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-800">{feature.title}</h3>
                                            <p className="text-sm text-gray-600">{feature.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="md:w-1/2 bg-gray-100 rounded-lg p-6 flex items-center justify-center">
                            {/* Placeholder for illustration */}
                            <div className="w-full h-64 rounded-lg bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full bg-blue-500 bg-opacity-10 flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-blue-500 bg-opacity-30 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-gray-50 opacity-0 transition-opacity duration-700" style={{ transitionDelay: "300ms" }}>
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: '🎥', title: 'Upload Video / Live Stream', desc: 'Connect your security cameras or upload recorded footage' },
                            { icon: '🧠', title: 'AI Model Analyzes Footage', desc: 'Our neural networks process each frame in real-time' },
                            { icon: '📊', title: 'Detects Violence & Assigns Score', desc: 'Incidents are classified with confidence percentages' },
                            { icon: '🚨', title: 'Alerts & Results Displayed', desc: 'Receive immediate notifications on potential threats' }
                        ].map((step, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md hover:transform hover:-translate-y-1 transition-all duration-300">
                                <div className="text-4xl mb-4">{step.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    <span className="text-blue-600 mr-2">{index + 1}.</span>
                                    {step.title}
                                </h3>
                                <p className="text-gray-600">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section id="use-cases" className="py-20 bg-white opacity-0 transition-opacity duration-700" style={{ transitionDelay: "400ms" }}>
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Use Cases</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                title: 'Schools & Colleges',
                                desc: 'Prevent bullying and campus violence, creating a safer learning environment for students and staff.',
                                icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14l-4-2m4 2l4-2'
                            },
                            {
                                title: 'Public Spaces',
                                desc: 'Monitor streets, parks, and crowded areas to enhance public safety and provide quick response to incidents.',
                                icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                            },
                            {
                                title: 'Events & Gatherings',
                                desc: 'Enhance security at concerts, stadiums, and protests, identifying potential security threats before they escalate.',
                                icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                            },
                            {
                                title: 'Corporate & Private Security',
                                desc: 'Protect employees in high-risk areas and secure valuable assets with proactive threat detection.',
                                icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                            }
                        ].map((useCase, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-6 flex">
                                <div className="mr-4 flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={useCase.icon} />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{useCase.title}</h3>
                                    <p className="text-gray-600">{useCase.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section
                id="contact"
                className="py-20 bg-gradient-to-br from-gray-700 to-gray-900 text-white opacity-0 transition-opacity duration-700 "
                style={{ transitionDelay: "500ms" }}
            >
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Enhance Your Security?</h2>
                    <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
                        Want to try our system?
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/videorecorder"
                            className="px-8 py-4 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-300 transform hover:scale-105 transition duration-300"
                        >
                            Try Now
                        </Link>
                        <Link
                            to="/technicaldetails"
                            className="px-8 py-4 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-gray-800 transform hover:scale-105 transition duration-300"
                        >
                            Explore Documentation
                        </Link>
                    </div>
                </div>
            </section>

           
           
        </div>
    );
};

export default Home;