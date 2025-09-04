import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Server } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background py-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-8"
        >
          Security at SandVar
        </motion.h1>
        
        <p className="text-lg text-muted-foreground mb-12">
          We are committed to keeping your data secure, private, and available. Our security practices 
          are designed to protect against unauthorized access, data loss, and misuse.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: ShieldCheck,
              title: "Best Practices",
              text: "We follow industry standards for security, including regular penetration testing and code reviews."
            },
            {
              icon: Lock,
              title: "Encryption",
              text: "All data is encrypted in transit with TLS 1.2+ and at rest using AES-256 encryption."
            },
            {
              icon: Server,
              title: "Infrastructure",
              text: "Our servers are hosted in secure, ISO 27001 and SOC 2 certified data centers."
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-background shadow-lg text-center"
            >
              <item.icon className="h-16 w-16 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-lg text-muted-foreground">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-4">Report a Security Issue</h2>
          <p className="text-lg text-muted-foreground">
            If you believe you have found a vulnerability, please email us at 
            <a href="mailto:support@sandvar.in" className="text-primary hover:underline"> support@sandvar.com</a>. 
            We will respond promptly and take appropriate action.
          </p>
        </div>
      </div>
    </div>
  );
}
