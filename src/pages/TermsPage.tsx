import React from "react";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-8"
        >
          Terms & Conditions
        </motion.h1>

        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>
            By using SandVar, you agree to comply with and be bound by these terms. Please read them carefully before using our services.
          </p>
          <h2 className="text-2xl font-semibold">Use of Service</h2>
          <p>
            You agree to use our services only for lawful purposes and in compliance with applicable laws.
          </p>
          <h2 className="text-2xl font-semibold">Intellectual Property</h2>
          <p>
            All content, trademarks, and code are the property of SandVar unless otherwise stated.
          </p>
          <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
          <p>
            We are not liable for any indirect or consequential damages resulting from your use of our services.
          </p>
          <p className="mt-8">Last updated: August 2025</p>
        </div>
      </div>
    </div>
  );
}
