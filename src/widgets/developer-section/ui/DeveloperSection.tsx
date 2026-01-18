"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Github, Mail } from "lucide-react";
import Image from "next/image";
import ElectricBorder from "@/shared/components/ElectricBorder";


export function DeveloperSection() {
  const t = useTranslations("home.developer");

  return (
    <section className="py-24 px-6 bg-secondary/5" id="about">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Header Content */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-linear-to-r from-violet-500 to-purple-600">
              {t("title")}
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* Developer Card */}
          <ElectricBorder
            color="#c86fc5"
            speed={0.5}
            chaos={0.10}
            style={{ borderRadius: 16 }}
          >
            <Card className="w-full max-w-3xl overflow-hidden border-muted/40 shadow-xl bg-background/50 backdrop-blur-sm transition-all hover:shadow-2xl">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Avatar / Visual Area */}
                  <div className="w-full md:w-1/3 bg-linear-to-br from-violet-100 to-purple-100 dark:from-violet-950/30 dark:to-purple-950/30 flex items-center justify-center p-8 md:p-0">
                    <div className="relative">
                      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background shadow-xl bg-white">
                        <Image
                          src="/pepe.jpeg"
                          alt="Developer"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 128px, 160px"
                        />
                      </div>
                      <div
                        className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-background"
                        title="Open to work"
                      />
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className="w-full md:w-2/3 p-8 md:p-10 text-left space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold">
                          Jaegu Kang (renine94)
                        </h3>
                        <Badge
                          variant="outline"
                          className="border-violet-500/30 text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-950/10"
                        >
                          {t("role")}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {t("bio")}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {t("techStackLabel")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-secondary/50 hover:bg-secondary"
                        >
                          Django
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-secondary/50 hover:bg-secondary"
                        >
                          SpringBoot
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-secondary/50 hover:bg-secondary"
                        >
                          Next.js
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-secondary/50 hover:bg-secondary"
                        >
                          TypeScript
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-secondary/50 hover:bg-secondary"
                        >
                          TailwindCSS
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-secondary/50 hover:bg-secondary"
                        >
                          Zustand
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <Button
                        variant="default"
                        className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                        asChild
                      >
                        <a
                          href="https://github.com/renine94"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="mailto:renine94.dev@gmail.com">
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ElectricBorder>
        </div>
      </div>
    </section>
  );
}
