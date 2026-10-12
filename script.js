/* ============================================================
   Naresh S × P V Akhila — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Sticky header: add border once scrolled ---- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu toggle ---- */
  var toggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");

  function closeMenu() {
    if (!toggle || !mobileMenu) return;
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("open");
    mobileMenu.hidden = true;
  }

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", function () {
      var isOpen = toggle.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        mobileMenu.hidden = false;
        // next frame so the display change applies before the class
        requestAnimationFrame(function () { mobileMenu.classList.add("open"); });
      } else {
        closeMenu();
      }
    });
    // Close when a link inside the menu is clicked
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Form & recipient wiring ---- */
  var form = document.getElementById("form");
  var note = document.getElementById("formNote");
  var bookingInput = document.getElementById("f-booking");
  var lookingInput = document.getElementById("f-looking");

  // Who the request should go to. Defaults to both (the Duo).
  var mailNaresh = form ? form.getAttribute("data-mail-naresh") : "";
  var mailAkhila = form ? form.getAttribute("data-mail-akhila") : "";
  var currentChoice = "The Duo";

  function recipientsFor(choice) {
    if (choice === "Naresh S") return [mailNaresh];
    if (choice === "P V Akhila") return [mailAkhila];
    return [mailNaresh, mailAkhila]; // Duo -> both
  }

  /* Resolve who the enquiry is for from the visible "looking for" field,
     so the recipient always matches what the visitor actually asked for. */
  function choiceFromLooking(text) {
    var t = (text || "").toLowerCase();
    var hasN = t.indexOf("naresh") !== -1;
    var hasA = t.indexOf("akhila") !== -1;
    if (t.indexOf("duo") !== -1 || t.indexOf("both") !== -1 || (hasN && hasA)) return "The Duo";
    if (hasN) return "Naresh S";
    if (hasA) return "P V Akhila";
    return null;
  }

  /* ---- Book buttons choose recipient + prefill the form ---- */
  document.querySelectorAll("[data-book]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var who = btn.getAttribute("data-book");
      currentChoice = who;
      if (bookingInput) bookingInput.value = who;
      if (lookingInput) {
        lookingInput.value = who === "The Duo" ? "Duo" : who;
      }
      var nameField = document.getElementById("f-name");
      if (nameField) {
        setTimeout(function () { nameField.focus(); }, 450);
      }
    });
  });

  function setNote(msg, kind) {
    if (!note) return;
    note.textContent = msg;
    note.className = "form-note" + (kind ? " " + kind : "");
  }

  function val(id) {
    var el = document.getElementById(id);
    return el && el.value ? el.value.trim() : "";
  }

  /* ---- Contact form: send straight to their inbox (no mail app) ---- */
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = val("f-name");
      var email = val("f-email");
      if (!name || !email) {
        setNote("Please add at least your name and email.", "err");
        return;
      }

      // Resolve from the visible "looking for" field first, so the
      // recipient always matches what the visitor actually asked for.
      var choice = choiceFromLooking(val("f-looking")) ||
                   (bookingInput && bookingInput.value) ||
                   currentChoice;
      var to = recipientsFor(choice).filter(Boolean);
      var greeting = choice === "The Duo" ? "Hi Naresh S and P V Akhila," : "Hi " + choice + ",";

      // Sent straight to their inbox via FormSubmit — no mail app involved.
      // _replyto makes "reply" in their inbox go to the visitor.
      var payload = {
        _subject: "Booking request — " + choice + " (" + name + ")",
        _template: "table",
        _captcha: "false",
        _replyto: email,
        "Greeting": greeting + " I'd like to enquire about booking " +
          (choice === "The Duo" ? "the duo" : choice) + ".",
        "Name": name,
        "Visitor email": email,
        "Organization / Event": val("f-org") || "—",
        "Event date": val("f-date") || "—",
        "Event type": val("f-type") || "—",
        "Expected audience": val("f-audience") || "—",
        "Location": val("f-location") || "—",
        "Looking for": val("f-looking") || choice,
        "Phone": val("f-phone") || "—",
        "Message": val("f-message") || "—"
      };

      var submitBtn = form.querySelector(".btn-submit");
      setNote("Sending your enquiry…", "");
      if (submitBtn) submitBtn.disabled = true;

      Promise.all(to.map(function (addr) {
        return fetch("https://formsubmit.co/ajax/" + addr, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload)
        }).then(function (res) { return res.json(); });
      })).then(function (results) {
        var ok = results.every(function (r) { return !!(r && r.success); });
        if (ok) {
          setNote(
            "Sent! Your enquiry is on its way to " +
              (choice === "The Duo" ? "Naresh S & P V Akhila" : choice) +
              " — they'll reply to " + email + ".",
            "ok"
          );
          form.reset();
          if (bookingInput) bookingInput.value = "";
          currentChoice = "The Duo";
        } else {
          setNote("Couldn't send just now — please email them directly using the contacts above.", "err");
        }
      }).catch(function () {
        setNote("Couldn't send just now — please email them directly using the contacts above.", "err");
      }).then(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
    });
  }
})();

/* ---------- Carousels: 3-up sliding window ---------- */
function initCarousel(trackId, prevId, nextId) {
  var track = document.getElementById(trackId);
  if (!track) return;
  var slides = track.children.length;
  var index = 0;
  function visible() { return window.innerWidth <= 680 ? 1 : 3; }
  function maxIndex() { return slides - visible(); }
  function go(i) {
    var m = maxIndex();
    index = i > m ? 0 : (i < 0 ? m : i);
    var w = track.children[0].getBoundingClientRect().width;
    var gap = parseFloat(getComputedStyle(track).gap) || 0;
    track.style.transform = 'translateX(' + (-index * (w + gap)) + 'px)';
  }
  document.getElementById(prevId).addEventListener('click', function () { go(index - 1); });
  document.getElementById(nextId).addEventListener('click', function () { go(index + 1); });
  window.addEventListener('resize', function () { go(index); });
}
initCarousel('fbTrack', 'fbPrev', 'fbNext');
initCarousel('watchTrack', 'watchPrev', 'watchNext');
