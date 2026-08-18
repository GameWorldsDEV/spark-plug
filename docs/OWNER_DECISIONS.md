# Owner decisions required before hosting or payments

The local product site and infrastructure specification can proceed without
these answers. Hosting, indexing, accounts, and payments cannot.

1. **Production home:** choose the Vercel project/organization and final
   GameWorlds subdomain or temporary `vercel.app` review URL.
2. **Contact addresses:** confirm that `hello@gameworlds.ai` is monitored for
   early access, privacy, terms, and security reports, or provide replacements.
3. **Pro billing:** confirm `$5/month` and the proposed `$48/year` option (20%
   annual discount). The annual option can be removed without changing the
   entitlement model.
4. **Pro+ economics:** approve verification criteria, marketplace fee, minimum
   price, refund/dispute policy, payout timing, tax handling, and whether Pro+
   has a separate subscription charge.
5. **Creator review:** decide who can publish paid packs and who approves a
   scrubbed manifest/checksum for public listing.
6. **Legal identity:** provide the contracting legal entity, address/jurisdiction,
   final privacy controller details, and counsel-approved consumer/marketplace
   language before accounts or payments open.
7. **Download targets:** provide the official free download, documentation, and
   public open-core URLs. The current CTA stays on the early-access form until
   those targets are approved.
8. **Production data:** choose a new public-launch Supabase project/region. Do
   not reuse the private product database.
9. **Payment gate:** authorize a separate Stripe test-mode integration only after
   decisions 3–6 are published. Live mode remains a distinct approval.
10. **Indexing date:** explicitly authorize `NEXT_PUBLIC_SITE_INDEXABLE=true`
    only after the exact production URL, metadata, legal pages, and public files
    are approved.
