[![Made with pollinations.ai](https://raw.githubusercontent.com/pollinations/pollinations/main/packages/ui/src/brand/badge-made-with.svg)](https://pollinations.ai/?ref=badge)

# 🚋 Jev at the Switch

Would you pull the lever? **Jev at the Switch** is a browser game that walks you
through eight trolley-problem dilemmas — from Philippa Foot's original lever to
the transplant ward — and then asks **Jev** (`typesafe/jev-1.13`, a fast, cheap
*decision model* on Pollinations) the very same question.

Jev doesn't write text. Through `POST /alpha/decisions` it returns a typed
verdict for each dilemma:

* a **choice** (act or stand by) with **calibrated confidence** and the full
  probability split between the options,
* two moral **scores** — how acceptable is acting, how acceptable is standing by —
  each with a legend and its own confidence.

You see where you and Jev agree and split, plus a damage report at the end:
your philosophical profile (deontologist, utilitarian, or somewhere in the
wobble), Jev's pattern across the killing-as-means cases, and how much you spent.

**Bring Your Own Pollen.** You sign in with your Pollinations account and
authorize the app to spend *your own* Pollen (default budget: 5). The session key
never leaves your browser tab. Jev bills input tokens only — a full 8-dilemma run
costs a fraction of a Pollen.

Inspired by Zach Landes' [Jev Meets the Trolley Problem](https://zachlandes.com/trolley-problem/).

## Play

Live at **https://marcus-mok-gh.github.io/jev-at-the-switch/**

## Run locally

Static page, no build step:

```bash
python3 -m http.server .
# open http://localhost:8000
```

## How it uses Pollinations

| What | Endpoint |
|---|---|
| Typed decisions (choice + confidence + probabilities, two moral scores) | `POST https://gen.pollinations.ai/alpha/decisions` with `model: typesafe/jev-1.13` |
| User authorization (spend their own Pollen, budgeted) | [Bring Your Own Pollen](https://github.com/pollinations/pollinations/blob/main/BRING_YOUR_OWN_POLLEN.md) fragment flow at `enter.pollinations.ai/authorize` |
| Pollen balance chip | `GET /account/balance` |

Built for Pollinations quest [#17647](https://github.com/pollinations/pollinations/issues/17647).
