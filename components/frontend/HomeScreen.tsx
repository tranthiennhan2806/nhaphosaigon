import React, { useState, useMemo, useEffect } from 'react';
import { Property, FilterState } from '@/types';
import { TARGET_DISTRICTS } from '@/configs/constants';
import { PropertyCard } from './PropertyCard';
import {
    Search,
    ChevronRight,
    Award,
    Shield,
    Clock,
    Users,
    MapPin,
    Building2,
    Star,
    TrendingUp,
    CheckCircle,
    Phone,
    Mail,
    ArrowRight,
    Home,
    Building,
    Landmark,
    TreePine
} from 'lucide-react';

interface HomeScreenProps {
    properties: Property[];
    navigateTo: (tab: string, id?: string) => void;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    onSync: () => void;
    isLoading: boolean;
}

export function HomeScreen({
    properties,
    navigateTo,
    setFilters,
    onSync,
    isLoading
}: HomeScreenProps) {
    const [quickSearch, setQuickSearch] = useState<string>('');
    const [quickLocation, setQuickLocation] = useState<string>('');
    const [isVisible, setIsVisible] = useState(true);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const featuredProperties = useMemo(() => {
        return properties.slice(0, 6);
    }, [properties]);

    const handleQuickAccess = (location: string) => {
        setFilters({
            search: '',
            type: 'sale',
            minPrice: '',
            maxPrice: '',
            minArea: '',
            maxArea: '',
            location: location,
        });
        navigateTo('listings');
    };

    // Testimonials data
    const testimonials = [
        {
            name: "Chị Nguyễn Thị Hương",
            role: "Khách hàng đã mua nhà",
            content: "Tôi đã tìm kiếm rất nhiều nơi nhưng chỉ có Dreamhome mang đến cho tôi những lựa chọn chất lượng nhất. Cảm ơn đội ngũ tư vấn nhiệt tình!",
            rating: 5
        },
        {
            name: "Anh Trần Văn Minh",
            role: "Nhà đầu tư",
            content: "Dreamhome là nền tảng uy tín mà tôi tin tưởng. Giao diện đẹp, thông tin chính xác và hỗ trợ khách hàng tuyệt vời.",
            rating: 5
        },
        {
            name: "Chị Lê Thị Mai",
            role: "Khách hàng đã bán nhà",
            content: "Tôi đã bán được căn nhà của mình chỉ sau 2 tuần đăng tin trên Dreamhome. Rất hài lòng với dịch vụ!",
            rating: 5
        }
    ];

    // Auto rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    // Quick access buttons data
    const quickAccessButtons = [
        {
            label: 'Quận 1',
            icon: Building,
            location: 'Quận 1',
            color: 'bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50'
        },
        {
            label: 'Quận 3',
            icon: Building2,
            location: 'Quận 3',
            color: 'bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50'
        },
        {
            label: 'Phú Nhuận',
            icon: Home,
            location: 'Phú Nhuận',
            color: 'bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50'
        },
        {
            label: 'Quận 7',
            icon: Landmark,
            location: 'Quận 7',
            color: 'bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/50'
        },
        {
            label: 'Nhà Bè',
            icon: TreePine,
            location: 'Nhà Bè',
            color: 'bg-teal-50 dark:bg-teal-950/30 hover:bg-teal-100 dark:hover:bg-teal-950/50'
        },
    ];

    return (
        <div
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="space-y-24"
        >
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                    <div className="absolute top-10 right-10 w-96 h-96 bg-neutral-900 dark:bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="relative p-8 sm:p-16 flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 px-4 py-2 rounded-full">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-600 dark:text-neutral-400">
                                🏆 Top 1 Nền tảng BĐS 2026
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight text-neutral-900 dark:text-white">
                            Tìm kiếm không gian sống
                            <br />
                            <span className="font-semibold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                                Đẳng cấp & Tinh tế
                            </span>
                        </h1>

                        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-lg">
                            Chúng tôi kết nối bạn với những bất động sản cao cấp nhất tại
                            <span className="font-semibold text-neutral-900 dark:text-white"> Quận trung tâm & Nam Sài Gòn</span>,
                            nơi kiến trúc và phong cách sống hòa quyện hoàn hảo.
                        </p>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-8 pt-4">
                            <div>
                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">500+</p>
                                <p className="text-[10px] tracking-wider text-neutral-400 uppercase">Bất động sản</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">98%</p>
                                <p className="text-[10px] tracking-wider text-neutral-400 uppercase">Hài lòng khách hàng</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900 dark:text-white">24/7</p>
                                <p className="text-[10px] tracking-wider text-neutral-400 uppercase">Hỗ trợ tận tâm</p>
                            </div>
                        </div>

                        {/* QUICK ACCESS BUTTONS - Thay thế search form */}
                        <div className="mt-8">
                            <button
                                onClick={() => navigateTo('listings')}
                                className="group w-full border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white bg-white dark:bg-neutral-950 px-8 py-4 text-[11px] tracking-[0.2em] uppercase font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                            >
                                <span>Xem tất cả khu vực</span>
                                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>

                    {/* Hero Image / Decoration */}
                    <div className="flex-1 hidden lg:flex items-center justify-center">
                        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                            <div className="space-y-4">
                                <div className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-lg overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80"
                                        alt="Property"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-lg overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"
                                        alt="Property"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-lg overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=400&q=80"
                                        alt="Property"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-lg overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80"
                                        alt="Property"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 mx-auto bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-4">
                        <Award className="w-6 h-6 text-neutral-900 dark:text-white" />
                    </div>
                    <h4 className="text-xs font-semibold tracking-widest uppercase dark:text-white">Chất lượng hàng đầu</h4>
                    <p className="text-[10px] text-neutral-400 mt-1 tracking-wider">BĐS được kiểm định kỹ lưỡng</p>
                </div>

                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 mx-auto bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-4">
                        <Shield className="w-6 h-6 text-neutral-900 dark:text-white" />
                    </div>
                    <h4 className="text-xs font-semibold tracking-widest uppercase dark:text-white">Pháp lý minh bạch</h4>
                    <p className="text-[10px] text-neutral-400 mt-1 tracking-wider">Hồ sơ pháp lý rõ ràng</p>
                </div>

                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 mx-auto bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-4">
                        <Clock className="w-6 h-6 text-neutral-900 dark:text-white" />
                    </div>
                    <h4 className="text-xs font-semibold tracking-widest uppercase dark:text-white">Hỗ trợ 24/7</h4>
                    <p className="text-[10px] text-neutral-400 mt-1 tracking-wider">Tư vấn tận tâm mọi lúc</p>
                </div>

                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 mx-auto bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-neutral-900 dark:text-white" />
                    </div>
                    <h4 className="text-xs font-semibold tracking-widest uppercase dark:text-white">Cộng đồng lớn</h4>
                    <p className="text-[10px] text-neutral-400 mt-1 tracking-wider">Hàng ngàn khách hàng tin tưởng</p>
                </div>
            </section>

            {/* FEATURED PROPERTIES */}
            <section className="space-y-8">
                <div className="text-center pt-4">
                    <button
                        onClick={() => {
                            setFilters({
                                search: '',
                                type: 'all',
                                minPrice: '',
                                maxPrice: '',
                                minArea: '',
                                maxArea: '',
                                location: ''
                            });
                            navigateTo('listings');
                        }}
                        className="border border-neutral-900 dark:border-white hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 px-8 py-3 text-xs tracking-widest uppercase font-medium transition-all"
                    >
                        Xem toàn bộ không gian
                    </button>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-8 sm:p-16">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <div>
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 block">
                            WHY DREAMHOME
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-light mt-2 dark:text-white">
                            Tại sao chọn <span className="font-semibold">Dreamhome</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div className="space-y-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            <h4 className="text-xs font-semibold tracking-widest uppercase dark:text-white">Uy tín hàng đầu</h4>
                            <p className="text-[11px] text-neutral-400 leading-relaxed">
                                Được hàng ngàn khách hàng tin tưởng và lựa chọn trong suốt nhiều năm hoạt động.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            <h4 className="text-xs font-semibold tracking-widest uppercase dark:text-white">Đa dạng lựa chọn</h4>
                            <p className="text-[11px] text-neutral-400 leading-relaxed">
                                Hàng trăm bất động sản tại các quận trung tâm và Nam Sài Gòn.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                            <h4 className="text-xs font-semibold tracking-widest uppercase dark:text-white">Hỗ trợ chuyên nghiệp</h4>
                            <p className="text-[11px] text-neutral-400 leading-relaxed">
                                Đội ngũ tư vấn giàu kinh nghiệm, sẵn sàng hỗ trợ bạn 24/7.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="space-y-8">
                <div className="text-center">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 block">
                        TESTIMONIALS
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-light mt-2 dark:text-white">
                        Khách hàng nói gì về <span className="font-semibold">Dreamhome</span>
                    </h2>
                </div>

                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
                    >
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="w-full flex-shrink-0 px-4">
                                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-900 p-8 max-w-2xl mx-auto text-center">
                                    <div className="flex justify-center gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-300 italic leading-relaxed">
                                        "{testimonial.content}"
                                    </p>
                                    <div className="mt-4">
                                        <p className="font-semibold dark:text-white text-sm">{testimonial.name}</p>
                                        <p className="text-[10px] text-neutral-400 uppercase tracking-wider">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTestimonial(index)}
                                className={`w-2 h-2 rounded-full transition-all ${activeTestimonial === index
                                    ? 'bg-neutral-900 dark:bg-white w-8'
                                    : 'bg-neutral-300 dark:bg-neutral-700'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-8 sm:p-16 text-center border border-neutral-800 dark:border-neutral-200">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h2 className="text-2xl sm:text-3xl font-light">
                        Sẵn sàng tìm kiếm không gian <br />
                        <span className="font-semibold">mơ ước của bạn?</span>
                    </h2>
                    <p className="text-sm text-neutral-400 dark:text-neutral-500 max-w-lg mx-auto">
                        Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về bất động sản phù hợp với bạn.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <a
                            href="tel:0901234567"
                            className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 px-8 py-3 text-xs tracking-widest uppercase font-medium transition-all flex items-center justify-center gap-2"
                        >
                            <Phone className="w-4 h-4" />
                            Gọi ngay: 090 994 1199
                        </a>
                        <button
                            onClick={() => navigateTo('listings')}
                            className="border border-white dark:border-neutral-900 hover:bg-white hover:text-neutral-900 dark:hover:bg-neutral-900 dark:hover:text-white px-8 py-3 text-xs tracking-widest uppercase font-medium transition-all"
                        >
                            Xem bất động sản
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomeScreen;