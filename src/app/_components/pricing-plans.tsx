"use client";

import { useState } from "react";
import { displayPrice, PLANS } from "@/lib/plans";
import styles from "../page.module.css";

export function PricingPlans() {
  const [annual, setAnnual] = useState(false);

  return (
    <div>
      <div className={styles.billingToggle} role="group" aria-label="Billing period">
        <button
          type="button"
          aria-pressed={!annual}
          onClick={() => setAnnual(false)}
        >
          Monthly
        </button>
        <button
          type="button"
          aria-pressed={annual}
          onClick={() => setAnnual(true)}
        >
          Annual <span>save 20%</span>
        </button>
      </div>
      <div className={styles.pricingGrid}>
        {PLANS.map((plan) => (
          <article
            className={`${styles.planCard} ${plan.featured ? styles.featuredPlan : ""}`}
            key={plan.id}
          >
            {plan.featured ? <span className={styles.popularTag}>MOST POPULAR</span> : null}
            <p className={styles.planEyebrow}>{plan.eyebrow}</p>
            <h3>{plan.name}</h3>
            <div className={styles.planPrice}>
              <strong>{displayPrice(plan, annual)}</strong>
              {plan.monthlyPrice !== null && plan.monthlyPrice > 0 ? (
                <span>/ month</span>
              ) : null}
            </div>
            {annual && plan.annualPrice ? (
              <p className={styles.annualNote}>Billed ${plan.annualPrice} yearly</p>
            ) : (
              <p className={styles.annualNote}>{plan.priceLabel}</p>
            )}
            <p className={styles.planDescription}>{plan.description}</p>
            <a href="#join" className={styles.planCta}>
              {plan.cta} <span aria-hidden="true">↗</span>
            </a>
            <ul>
              {plan.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
