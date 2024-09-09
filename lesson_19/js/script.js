"use strict"
const header = document.querySelector(".header");
window.addEventListener("scroll", scrollPage);

function scrollPage(e) {
  const verticalScroll = window.scrollY;
  if (verticalScroll > 0) {
    header.classList.add("_scroll");
  } else {
    header.classList.remove("_scroll");
  }
}
// ------------- search unfocus delay (search icon and search button in one place) -------------
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search")
  const searchLabel = document.getElementById("search-label")
  const searchButton = document.getElementById("search-button")

  searchInput.addEventListener("focus", function () {
    searchLabel.style.display = "none"
    searchButton.style.display = "block"
  })

  searchInput.addEventListener("blur", function () {
    setTimeout(() => {
      if (!searchButton.contains(document.activeElement)) {
        searchLabel.style.display = "block"
        searchButton.style.display = "none"
      }
    }, 100)
  })
})
// ------------- END OF search unfocus delay -------------

// ------------- burger menu -------------
const iconMenu = document.querySelector(".icon-menu")
const menuBody = document.querySelector(".navigation-body")
const menuLinks = document.querySelectorAll(
  ".list-menu, .menu__sublink, .top-header__buttons, .top-header__search, .top-header__logo"
)

if (iconMenu) {
  iconMenu.addEventListener("click", function () {
    toggleMenu()
  })

  // Event handlers for menu items and subitems
  menuLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (iconMenu.getAttribute("1") === "true") {
        toggleMenu()
      }
    })
  })

  // Toggle menu function
  function toggleMenu() {
    const isExpanded = iconMenu.getAttribute("aria-expanded") === "true"
    iconMenu.setAttribute("aria-expanded", !isExpanded)
    document.body.classList.toggle("body--lock", !isExpanded)
    iconMenu.classList.toggle("_active", !isExpanded)
    menuBody.classList.toggle("_active", !isExpanded)
  }

  // Close hamburger menu on device rotating
  window.addEventListener("orientationchange", function () {
    iconMenu.setAttribute("aria-expanded", "false")
    document.body.classList.remove("body--lock")
    iconMenu.classList.remove("_active")
    menuBody.classList.remove("_active")
  })
}
// ------------- END OF hamburger menu -------------

// ------------- Tabs -------------
function initializeTabSwitching(containerSelector) {
  const container = document.querySelector(containerSelector)

  if (!container) {
    console.error(`Container with selector ${containerSelector} not found.`)
    return
  }

  container.addEventListener("click", documentActions)

  function documentActions(e) {
    const targetElement = e.target

    if (
      targetElement.classList.contains("tab-button") &&
      !targetElement.classList.contains("_active")
    ) {
      const activeElement = container.querySelector(".tab-button._active")
      const elements = container.querySelectorAll(".tab-item")
      const elementType = targetElement.dataset.tabType

      activeElement.classList.remove("_active")
      targetElement.classList.add("_active")

      elements.forEach((element) => {
        !elementType || element.dataset.tabType === elementType
          ? (element.style.display = "")
          : (element.style.display = "none")
      })
      // swiper.update()
      if (swiper) {
        swiper.update() // Обновление Swiper
        swiper.autoplay.start() // Перезапуск autoplay
      }
    }
  }
}

// apply to the listed containers only
initializeTabSwitching(".has-all-button-tabs-1")
initializeTabSwitching(".has-all-button-tabs-2")
// ------------- END OF Tabs -------------

// ------------- Slider SWIPER -------------
let swiper
if (document.querySelector(".slider__swiper")) {
  swiper = new Swiper(".slider__swiper", {
    speed: 1000,
    loop: true,
    autoplay: {
      delay: 6000,
      reverseDirection: true,
      disableOnInteraction: false,
      // pauseOnMouseEnter: true,
    },
    // Default parameters
    slidesPerView: 1,
    spaceBetween: 10,
    // Responsive breakpoints
    breakpoints: {
      // when window width is >= 320px
      480: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      // when window width is >= 480px
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      // when window width is >= 640px
      1024: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    },
    // Navigation arrows
    navigation: {
      nextEl: ".slider__arrow--next",
      prevEl: ".slider__arrow--prev",
    },
    on: {
      init: function () {
        this.el.addEventListener("mouseenter", () => {
          this.autoplay.stop()
        })
        this.el.addEventListener("mouseleave", () => {
          this.autoplay.start()
        })
      },
    },
  })
}

// ------------- Spoilers -------------
// Get all elements with the attribute data-spoilers
const spoilersArray = document.querySelectorAll("[data-spoilers]")

// Add styles to hide the marker for summary inside data-spoilers
const style = document.createElement("style")
style.textContent = `
  [data-spoilers] summary {
    list-style-type: none;
  }
`
document.head.appendChild(style)

// Check if there are elements with the data-spoilers attribute
if (spoilersArray.length > 0) {
  spoilersArray.forEach((spoilersBlock) => {
    // Find all <details> elements inside each data-spoilers block and set their open attribute
    const detailsElements = spoilersBlock.querySelectorAll("details")
    detailsElements.forEach((details) => {
      details.setAttribute("open", "") // Set the open attribute initially
      details.addEventListener("click", (e) => e.preventDefault())
    })

    // Find all <summary> elements inside each data-spoilers block and disable their default functionality
    const summaryElements = spoilersBlock.querySelectorAll("summary")
    summaryElements.forEach((summary) => {
      summary.addEventListener("click", (e) => e.preventDefault())
    })
  })

  // Filter elements without a specified type (regular spoilers)
  const spoilersRegular = Array.from(spoilersArray).filter(function (
    item,
    index,
    self
  ) {
    return !item.dataset.spoilers.split(",")[0]
  })

  // Initialize regular spoilers if they exist
  if (spoilersRegular.length > 0) {
    initSpoilers(spoilersRegular)
  }

  // Filter elements with a specified type (media queries)
  const spoilersMedia = Array.from(spoilersArray).filter(function (
    item,
    index,
    self
  ) {
    return item.dataset.spoilers.split(",")[0]
  })

  // Initialize media spoilers if they exist
  if (spoilersMedia.length > 0) {
    // Create an array of breakpoints for media queries
    const breakpointsArray = []
    spoilersMedia.forEach((item) => {
      const params = item.dataset.spoilers
      const breakpoint = {}
      const paramsArray = params.split(",")
      breakpoint.value = paramsArray[0]
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max"
      breakpoint.item = item
      breakpointsArray.push(breakpoint)
    })

    // Create an array of media queries
    let mediaQueries = breakpointsArray.map(function (item) {
      return (
        "(" +
        item.type +
        "-width: " +
        item.value +
        "px)," +
        item.value +
        "," +
        item.type
      )
    })
    mediaQueries = mediaQueries.filter(function (item, index, self) {
      return self.indexOf(item) === index
    })

    // Add event listeners for each media query
    mediaQueries.forEach((breakpoint) => {
      const paramsArray = breakpoint.split(",")
      const mediaBreakpoint = paramsArray[1]
      const mediaType = paramsArray[2]
      const matchMedia = window.matchMedia(paramsArray[0])

      const spoilersArray = breakpointsArray.filter(function (item) {
        if (item.value === mediaBreakpoint && item.type === mediaType) {
          return true
        }
      })

      matchMedia.addListener(function () {
        initSpoilers(spoilersArray, matchMedia)
      })
      initSpoilers(spoilersArray, matchMedia)
    })
  }

  // Spoiler initialization
  function initSpoilers(spoilersArray, matchMedia = false) {
    spoilersArray.forEach((spoilersBlock) => {
      spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock
      if (matchMedia.matches || !matchMedia) {
        spoilersBlock.classList.add("_init")
        initSpoilerBody(spoilersBlock)
        spoilersBlock.addEventListener("click", setSpoilerAction)
      } else {
        spoilersBlock.classList.remove("_init")
        initSpoilerBody(spoilersBlock, false)
        spoilersBlock.removeEventListener("click", setSpoilerAction)
      }
    })
  }

  // Initialize spoiler body
  function initSpoilerBody(spoilersBlock, hideSpoilerBody = true) {
    const spoilerTitles = spoilersBlock.querySelectorAll("[data-spoiler]")
    if (spoilerTitles.length > 0) {
      spoilerTitles.forEach((spoilerTitle) => {
        if (hideSpoilerBody) {
          spoilerTitle.removeAttribute("tabindex")
          if (!spoilerTitle.classList.contains("_active")) {
            spoilerTitle.nextElementSibling.hidden = true
          }
        } else {
          spoilerTitle.setAttribute("tabindex", "-1")
          spoilerTitle.nextElementSibling.hidden = false
        }
      })
    }
  }

  // Click event handler for spoilers
  function setSpoilerAction(e) {
    const el = e.target
    if (el.hasAttribute("data-spoiler") || el.closest("[data-spoiler]")) {
      const spoilerTitle = el.hasAttribute("data-spoiler")
        ? el
        : el.closest("[data-spoiler]")
      const spoilersBlock = spoilerTitle.closest("[data-spoilers]")
      const oneSpoiler = spoilersBlock.hasAttribute("data-one-spoiler")
        ? true
        : false
      if (!spoilersBlock.querySelectorAll("._slide").length) {
        if (oneSpoiler && !spoilerTitle.classList.contains("_active")) {
          hideSpoilersBody(spoilersBlock)
        }
        spoilerTitle.classList.toggle("_active")
        _slideToggle(spoilerTitle.nextElementSibling, 300)
      }
      e.preventDefault()
    }
  }

  // Hide the body of the active spoiler
  function hideSpoilersBody(spoilersBlock) {
    const spoilerActiveTitle = spoilersBlock.querySelector(
      "[data-spoiler]._active"
    )
    if (spoilerActiveTitle) {
      spoilerActiveTitle.classList.remove("_active")
      _slideUp(spoilerActiveTitle.nextElementSibling, 300)
    }
  }
}

// Sliding display of an element (hide)
let _slideUp = (target, duration = 300) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide")
    target.style.transitionProperty = "height, margin, padding"
    target.style.transitionDuration = duration + "ms"
    target.style.height = target.offsetHeight + "px"
    target.offsetHeight
    target.style.overflow = "hidden"
    target.style.height = 0
    target.style.paddingTop = 0
    target.style.paddingBottom = 0
    target.style.marginTop = 0
    target.style.marginBottom = 0
    window.setTimeout(() => {
      target.hidden = true
      target.style.removeProperty("height")
      target.style.removeProperty("padding-top")
      target.style.removeProperty("padding-bottom")
      target.style.removeProperty("margin-top")
      target.style.removeProperty("margin-bottom")
      target.style.removeProperty("overflow")
      target.style.removeProperty("transition-duration")
      target.style.removeProperty("transition-property")
      target.classList.remove("_slide")
    }, duration)
  }
}

// Sliding display of an element (show)
let _slideDown = (target, duration = 300) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide")
    if (target.hidden) {
      target.hidden = false
    }
    let height = target.offsetHeight
    target.style.overflow = "hidden"
    target.style.height = 0
    target.style.paddingTop = 0
    target.style.paddingBottom = 0
    target.style.marginTop = 0
    target.style.marginBottom = 0
    target.offsetHeight
    target.style.transitionProperty = "height, margin, padding"
    target.style.transitionDuration = duration + "ms"
    target.style.height = height + "px"
    target.style.removeProperty("padding-top")
    target.style.removeProperty("padding-bottom")
    target.style.removeProperty("margin-top")
    target.style.removeProperty("margin-bottom")
    window.setTimeout(() => {
      target.style.removeProperty("height")
      target.style.removeProperty("overflow")
      target.style.removeProperty("transition-duration")
      target.style.removeProperty("transition-property")
      target.classList.remove("_slide")
    }, duration)
  }
}

// Toggle sliding display of an element
let _slideToggle = (target, duration = 300) => {
  if (target.hidden) {
    return _slideDown(target, duration)
  } else {
    return _slideUp(target, duration)
  }
}
// ------------- END OF Spoilers -------------

// ------------- smooth UP scroll -------------
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (e) {
    const targetElement = e.target

    if (targetElement.closest(".paymant-block__scroll")) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
      e.preventDefault()
    }
  })
})
// ------------- END OF smooth UP scroll -------------

// ----- onload animation --------------
window.addEventListener("load", windowLoad)
function windowLoad() {
  document.body.classList.add("loaded")
}

// ----- on-scroll animation --------------
const items = document.querySelectorAll("[data-animated]")

const appearThreshold = 0.3

const appearOptions = {
  threshold: appearThreshold,
}

const handleIntersection = (entry) => {
  if (entry.isIntersecting && entry.intersectionRatio >= appearThreshold) {
    entry.target.classList.add("active")
  } else {
    entry.target.classList.remove("active")
  }
}

const appearObserver = new IntersectionObserver((entries) => {
  entries.forEach(handleIntersection)
}, appearOptions)

const animateOnScroll = () => {
  items.forEach((item) => {
    const itemTop = item.getBoundingClientRect().top
    const windowHeight = window.innerHeight

    if (itemTop - windowHeight <= 0) {
      item.classList.add("active")
    } else {
      item.classList.remove("active")
    }
  })
}

// Checking the existence of elements
if (items.length > 0) {
  items.forEach((item) => {
    appearObserver.observe(item)
  })

  window.addEventListener("scroll", animateOnScroll)
}
// ----- END OF on-scroll animation --------------

// ----- parallax --------------
function updateParallax(container, x, y) {
  const parallaxItems = container.querySelectorAll(".parallax-item")

  parallaxItems.forEach((item, index) => {
    let speedX, speedY

    switch (index) {
      case 0:
        speedX = 0.05
        speedY = 0.05
        break
      case 1:
        speedX = -0.05
        speedY = -0.05
        // speedX = -0.1
        // speedY = 0.1
        break
      case 2:
        speedX = 0.1
        speedY = -0.1
        break
      case 3:
        // speedX = -0.1
        // speedY = 0.1
        speedX = -0.05
        speedY = -0.05
        break
      default:
        speedX = 0
        speedY = 0
    }
    item.style.transform = `translate(${x * speedX}px, ${y * speedY}px)`
  })
}

const container1 = document.getElementById("parallax-container-1")
const container2 = document.getElementById("parallax-container-2")

container1.addEventListener("mousemove", (e) => {
  const x = (window.innerWidth - e.pageX * 30) / 100
  const y = (window.innerHeight - e.pageY * 30) / 100
  updateParallax(container1, x, y)
})

container2.addEventListener("mousemove", (e) => {
  const x = (window.innerWidth - e.pageX * 20) / 100
  const y = (window.innerHeight - e.pageY * 20) / 100
  updateParallax(container2, x, y)
})
// ----- END OF parallax --------------
