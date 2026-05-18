"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useCarousel } from "@/components/ui/carousel";

interface GalleryHoverCarouselItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
}

export default function GalleryHoverCarousel({
  heading = "Featured Projects",
  subHeading = "",
  demoUrl = "#",
  items = [
    {
      id: "item-1",
      title: "Build Modern UIs",
      summary:
        "Create stunning user interfaces with our comprehensive design system.",
      url: "#",
      image:
        "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/dashboard-02.png",
    },
    {
      id: "item-2",
      title: "Computer Vision Technology",
      summary:
        "Powerful image recognition and processing capabilities that allow AI systems to analyze, understand, and interpret visual information from the world.",
      url: "#",
      image:
        "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/dashboard-gradient.png",
    },
    {
      id: "item-3",
      title: "Machine Learning Automation",
      summary:
        "Self-improving algorithms that learn from data patterns to automate complex tasks and make intelligent decisions with minimal human intervention.",
      url: "#",
      image:
        "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/featured-01.png",
    },
    {
      id: "item-4",
      title: "Predictive Analytics",
      summary:
        "Advanced forecasting capabilities that analyze historical data to predict future trends and outcomes, helping businesses make data-driven decisions.",
      url: "#",
      image:
        "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/featured-06.png",
    },
    {
      id: "item-5",
      title: "Neural Network Architecture",
      summary:
        "Sophisticated AI models inspired by human brain structure, capable of solving complex problems through deep learning and pattern recognition.",
      url: "#",
      image:
        "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/Screenshot%202025-08-05%20at%2021-15-55%20Ruixen%20-%20Beautifully%20crafted%20UI%20components%20to%20elevate%20your%20web%20projects.png",
    }
  ],
}: {
  heading?: string;
  subHeading?: string;
  demoUrl?: string;
  items?: GalleryHoverCarouselItem[];
}) {
  return (
    <section className="py-32 bg-[#08061A]">
      <div className="max-w-[1600px] mx-auto px-6">
        <Carousel className="relative w-full max-w-full">
          <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
            <div className="max-w-3xl">
              <h3 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white italic tracking-tight">
              {heading}{" "}
              <span className="text-[#837FFB] block sm:inline mt-2 sm:mt-0">
                {subHeading}
              </span>
            </h3>
            </div>
          </div>

          <div className="w-full max-w-full">
            {/* Native Side-Scroll for Mobile (No JS dependency, smoother on touch) */}
            <div className="flex lg:hidden overflow-x-auto snap-x snap-mandatory hide-scrollbar -ml-6 px-6 gap-5 pb-8">
              {items.map((item) => (
                <div key={item.id} className="min-w-[85vw] snap-center">
                  <Link to={item.url} className="block w-full">
                    <Card className="overflow-hidden rounded-[24px] bg-[#0D0B24] border-white/5 relative h-[400px]">
                      {/* Image Area */}
                      <div className="relative h-[55%] w-full">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                      
                      {/* Content Area - Always Visible on Mobile */}
                      <div className="p-6 h-[45%] flex flex-col justify-center bg-[#08061A]/95 backdrop-blur-md border-t border-white/5">
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
                          {item.summary}
                        </p>
                        
                        <div className="absolute bottom-4 right-4">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 border-white/10 bg-white/5 rounded-full"
                          >
                            <ArrowRight className="size-4 text-white" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>

            {/* Desktop View: Interactive Carousel */}
            <CarouselContent className="hidden lg:flex hide-scrollbar w-full max-w-full -ml-4">
              {items.map((item) => (
                <CarouselItem key={item.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <Link to={item.url} className="group block relative w-full h-[450px]">
                    <Card className="overflow-hidden rounded-[32px] h-full w-full bg-[#0D0B24] border-white/5 transition-all duration-700 group-hover:border-[#837FFB]/40 group-hover:shadow-[0_20px_50px_rgba(131,127,251,0.15)] relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#837FFB]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      {/* Image */}
                      <div className="relative h-full w-full transition-all duration-500 group-hover:h-[45%]">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
 
                      {/* Text Section */}
                      <div className="absolute bottom-0 left-0 w-full px-6 transition-all duration-500 group-hover:h-[55%] group-hover:flex flex-col justify-center bg-[#08061A]/95 backdrop-blur-md opacity-0 group-hover:opacity-100 border-t border-white/5">
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
                          {item.summary}
                        </p>
                        <div className="absolute bottom-4 right-4 z-20">
                          <Button
                            variant="outline"
                            size="icon"
                            className="group/btn relative h-12 w-12 border-white/10 bg-white/5 hover:bg-[#837FFB] hover:border-[#837FFB] transition-all duration-500 rounded-full overflow-hidden shadow-2xl"
                          >
                            <div className="absolute inset-0 bg-[#837FFB] scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full" />
                            <ArrowRight className="relative z-10 size-5 text-white group-hover:-rotate-45 transition-all duration-500" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
        </Carousel>
      </div>
    </section>
  );
}

function CarouselNavigation() {
  const { index, setIndex, itemsCount } = useCarousel();

  return (
    <div className="flex gap-2 mt-4 md:mt-0">
      <Button
        variant="outline"
        size="icon"
        onClick={() => { if (index > 0) setIndex(index - 1); }}
        disabled={index === 0}
        className="h-10 w-10 rounded-full"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => { if (index < itemsCount - 1) setIndex(index + 1); }}
        disabled={index + 1 === itemsCount}
        className="h-10 w-10 rounded-full"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}