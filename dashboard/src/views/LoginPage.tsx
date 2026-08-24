import React, { useState, type FormEvent } from "react";
import {
  Activity, ArrowRight, Check, Eye, EyeOff, Fingerprint,
  LoaderCircle, Lock, ShieldCheck, Sparkles, User
} from "lucide-react";

import "./LoginPage.css";
import { DEMO_ACCOUNTS, type DemoAccount } from "../auth/demoAccounts";

interface LoginPageProps {
  onLogin: (serviceId: string, password: string) => Promise<void>;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [serviceId, setServiceId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);

  function wait(ms: number) {
    return new Promise((resolve) =>
      setTimeout(resolve, ms)
    );
  }

  /*
   * Demo shortcuts only autofill credentials.
   * They DO NOT determine authorization.
   *
   * The actual role is always returned
   * by the authentication service.
   */
  function handleDemoShortcut(shortcut: DemoAccount) {
    setServiceId(shortcut.serviceId);
    if (shortcut.password) {
      setPassword(shortcut.password);
    } else {
      setPassword("");
    }
    setSelectedRole(shortcut.label);
    setError("");
  }

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!serviceId.trim()) {
      setError("Service ID is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    const upperServiceId = serviceId.toUpperCase();
    if (selectedRole === "Welfare Officer" && !upperServiceId.includes("-WEL-")) {
      setError("Only respective officer should be able to login.");
      return;
    }
    
    if (selectedRole === "Commander" && !upperServiceId.includes("-CMD-")) {
      setError("Only respective officer should be able to login.");
      return;
    }

    try {
      setLoading(true);
      setVerificationStep(0);

      const loginPromise = onLogin(serviceId, password);

      setVerificationStep(1);
      await wait(220);
      setVerificationStep(2);
      await wait(220);
      setVerificationStep(3);
      await wait(300);

      await loginPromise;
    } catch (error) {
      setLoading(false);
      setVerificationStep(0);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Unable to sign in."
        );
      }
    }
  }

  return (
    <main className="loginPage">

      {/* Decorative background grid */}

      <div className="gridBackground" />

      {/* =========================
          HEADER
      ========================= */}

      <header className="loginHeader">

        <div className="brand">

          <div className="brandIcon">
            <Activity size={20} />
          </div>

          <div className="brandText">

            <strong>
              CENTURION
            </strong>

            <p>
              Welfare & Early-Warning
              Intelligence Platform
            </p>

          </div>

        </div>

        <div className="networkStatus">

          <span className="networkDot" />

          <span>
            CAPF WELFARE NETWORK
          </span>

          <div className="secureBadge">

            <ShieldCheck size={14} />

            SECURE ACCESS

          </div>

        </div>

      </header>

      {/* =========================
          MAIN LAYOUT
      ========================= */}

      <div className="loginContainer">

        {/* =========================
            LEFT HERO SECTION
        ========================= */}

        <section className="hero">

          <div className="heroBadge">

            <Sparkles size={15} />

            PRIVACY-FIRST WELFARE
            INTELLIGENCE

          </div>

          <h1>

            Human Wellbeing.

            <br />

            <span>
              Operational Readiness
              <i>.</i>
            </span>

          </h1>

          <p className="heroText">

            Detect meaningful changes early,
            explain why they matter, and enable
            timely human welfare support.

          </p>

          <div className="featureList">

            <div>
              <Check size={15} />
              Personal Baselines
            </div>

            <div>
              <Check size={15} />
              Explainable Signals
            </div>

            <div>
              <Check size={15} />
              Human-Led Intervention
            </div>

          </div>

          {/* =========================
              ABSTRACT AI VISUAL
          ========================= */}

          <div className="visual">

            <div className="visualGlow" />

            <div className="circle circle1" />
            <div className="circle circle2" />
            <div className="circle circle3" />

            <div className="centerNode">

              <div className="fingerprint">

                <Fingerprint size={27} />

              </div>

              <small>
                PERSONAL
              </small>

              <strong>
                BASELINE
              </strong>

              <p>
                Individual Pattern
              </p>

            </div>

            <SignalNode
              className="duty"
              text="DUTY LOAD"
            />

            <SignalNode
              className="deployment"
              text="DEPLOYMENT"
            />

            <SignalNode
              className="leave"
              text="LEAVE PATTERN"
            />

            <SignalNode
              className="wellness"
              text="WELLNESS"
            />

            <SignalNode
              className="recovery"
              text="RECOVERY"
            />

            <SignalNode
              className="checkin"
              text="CHECK-IN ACTIVITY"
            />

            <div className="supportCard">

              <div>

                <small>
                  EXPLAINABLE EARLY SIGNAL
                </small>

                <strong>
                  Human Support
                </strong>

              </div>

              <ArrowRight size={18} />

            </div>

          </div>

          <div className="heroFooter">

            <strong>
              Welfare, not surveillance.
            </strong>

            <p>

              Privacy-first

              <span>•</span>

              Explainable AI

              <span>•</span>

              Human-in-the-loop

            </p>

          </div>

        </section>

        {/* =========================
            LOGIN SIDE
        ========================= */}

        <section className="loginSide">

          <div className="loginCard">

            <div className="portalTitle">

              <Sparkles size={14} />

              AUTHORIZED ACCESS PORTAL

            </div>

            <h2>
              Welcome back.
            </h2>

            <p className="subtitle">

              Sign in with your authorized
              service credentials to continue.

            </p>

            {/* =========================
                DEMO SHORTCUTS
            ========================= */}

            <div className="shortcutSection">

              <label>
                DEMO ACCOUNT SHORTCUTS
              </label>

              <div className="shortcutGrid">

                {DEMO_ACCOUNTS.map(
                  (shortcut) => (
                    <button
                      type="button"
                      key={shortcut.label}
                      onClick={() =>
                        handleDemoShortcut(shortcut)
                      }
                      className={
                        selectedRole === shortcut.label
                          ? "shortcut active"
                          : "shortcut"
                      }
                    >

                      <strong>
                        {shortcut.label}
                      </strong>

                      <span>
                        {shortcut.subtitle}
                      </span>

                      {selectedRole ===
                        shortcut.label && (
                        <Check
                          size={14}
                          className="selectedCheck"
                        />
                      )}

                    </button>
                  )
                )}

              </div>

            </div>

            {/* =========================
                LOGIN FORM
            ========================= */}

            <form
              onSubmit={handleLogin}
              className="loginForm"
            >

              {/* LOGIN ID */}

              <div className="formGroup">
                <label>SERVICE ID</label>
                <div className="inputBox">
                  <User size={18} />
                  <input
                    type="text"
                    value={serviceId}
                    placeholder="Enter Service ID"
                    autoComplete="username"
                    onChange={(event) => {
                      setServiceId(event.target.value);
                      setError("");
                    }}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="formGroup">
                <label>
                  PASSWORD
                </label>
                <div className="inputBox">
                  <Lock size={18} />
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    onChange={(event) => {
                      setPassword(
                        event.target.value
                      );
                      setError("");
                    }}
                  />

                  <button
                    type="button"
                    className="eyeButton"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>

              {/* ERROR */}

              {error && (

                <div className="errorBox">
                  {error}
                </div>

              )}

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="loginButton"
                disabled={loading}
              >

                Sign In Securely

                <ArrowRight size={20} />

              </button>

            </form>

            {/* =========================
                SECURITY INFORMATION
            ========================= */}

            <div className="securityBox">

              <ShieldCheck size={21} />

              <div>

                <strong>
                  Protected by Role-Based
                  Access Control
                </strong>

                <p>

                  Access is restricted
                  according to your authorized
                  role and assigned access scope.

                </p>

              </div>

            </div>

            <div className="cardFooter">

              <span>
                <Lock size={11} />
                Secure Access
              </span>

              <span>•</span>

              <span>
                Privacy First
              </span>

              <span>•</span>

              <span>
                Audited
              </span>

            </div>

            {/* =========================
                VERIFICATION OVERLAY
            ========================= */}

            {loading && (

              <div className="verifyOverlay">

                <div className="verifyIcon">

                  {verificationStep < 3 ? (

                    <LoaderCircle
                      size={34}
                      className="spinner"
                    />

                  ) : (

                    <ShieldCheck
                      size={34}
                    />

                  )}

                </div>

                <h3>
                  Verifying credentials
                </h3>

                <p>
                  Establishing secure
                  welfare access...
                </p>

                <VerifyItem
                  done={
                    verificationStep >= 1
                  }
                  text="Identity verified"
                />

                <VerifyItem
                  done={
                    verificationStep >= 2
                  }
                  text="Role verified"
                />

                <VerifyItem
                  done={
                    verificationStep >= 3
                  }
                  text="Access scope verified"
                />

              </div>

            )}

          </div>

        </section>

      </div>

    </main>
  );
}

/*
 * Small signal node used in
 * the left-side visualization.
 */
function SignalNode({
  className,
  text,
}: {
  className: string;
  text: string;
}) {
  return (
    <div
      className={`signal ${className}`}
    >
      <i />

      {text}
    </div>
  );
}

/*
 * Authentication verification item.
 */
function VerifyItem({
  done,
  text,
}: {
  done: boolean;
  text: string;
}) {
  return (
    <div
      className={
        done
          ? "verifyItem done"
          : "verifyItem"
      }
    >

      {done ? (

        <Check size={15} />

      ) : (

        <span className="emptyCircle" />

      )}

      {text}

    </div>
  );
}
