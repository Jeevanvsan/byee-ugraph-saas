import React from "react";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-8"
        >
          Privacy Policy
        </motion.h1>

        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>
            At SandVar, we take your privacy seriously. This policy explains what information we collect, how we use it, and your rights regarding your data.
          </p>
          <h2 className="text-2xl font-semibold">Information We Collect</h2>
          <p>
            We collect personal information you provide, such as your name, email, and usage data to improve our services.
          </p>
          <h2 className="text-2xl font-semibold">How We Use Information</h2>
          <p>
            We use your data to provide, maintain, and improve SandVar services, communicate with you, and comply with legal obligations.
          </p>
          <h2 className="text-2xl font-semibold">Your Rights</h2>
          <p>
            You can request access, correction, or deletion of your personal data at any time by contacting us at 
            <a href="mailto:support@sandvar.in" className="text-primary hover:underline"> support@sandvar.in</a>.
          </p>
          <p className="mt-8">Last updated: August 2025</p>
        </div>
      </div>
    </div>
  );
}
