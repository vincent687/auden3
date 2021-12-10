//****************************************
// Website scripts
//****************************************

// Event DOM ready
var callback = function(){
  // ================
  // Global data
  // ================
  const loadMoreBtn = document.querySelector('#load-more-posts');
  const tagLoadMoreBtn = document.querySelector('#tag-load-more-posts');
  const tagPagePostsContainer = document.querySelector('#tag-page-posts');
  const darkSwitch = document.querySelector('#theme-dark');
  const lightSwitch = document.querySelector('#theme-light');
  const menuModal = document.querySelector('#menu');
  const menuOpen = document.querySelector('#menu-open');
  const menuClose = document.querySelector('#menu-close');
  const searchModal = document.querySelector('#search');
  const searchOpen = document.querySelector('#search-open');
  const searchClose = document.querySelector('#search-close');
  const searchForm = document.querySelector('#search-form');
  const searchField = document.querySelector('#ghost-search-field');
  const searchResults = document.querySelector('#ghost-search-results');
  const browserNotSupportModal = document.querySelector('#browser-not-support');
  const browserNotSupportModalButton = browserNotSupportModal.querySelector('#browser-not-support-button');
  const searchByTags = document.querySelectorAll('.js-search-tag');
  const msgBoxes = document.querySelectorAll('.js-msg-close');
  const images = document.querySelectorAll('article.post img');
  const galleryImages = document.querySelectorAll('.kg-gallery-image img');
  const subscribeButton = document.querySelector('.subscribe-button');
  const socialShare = document.querySelectorAll('.js-share');
  const progressbar = document.querySelector('#progress');
  const postToc = document.querySelector('.post.has-toc');
  const scrollTop = document.querySelector('.scroll-to-top');
  const rollingBanner = document.querySelector('.rolling-banner-glide');
  const languageButtons = document.querySelectorAll('.language-btn');
  const postContent = document.querySelector('.post__content');
  const mainTags = document.querySelectorAll('.page-tags__main-tag');
  const subTagNavigator = document.querySelector('#sub-tag-navigator');

  const lang = document.documentElement.lang;
  const langPrefix = getLanguagePrefixByLanguage(lang);

  // =======
  // Cookie banner
  // =======
  if(!getCookie('accept-cookie')) {
    const cookieBanner = document.createElement('div');
    const acceptButton = document.createElement('button');
    cookieBanner.classList.add('cookie-banner');
    acceptButton.classList.add('btn', 'btn--brand')
    acceptButton.onclick = function() {
      setCookie('accept-cookie', 'true')
      cookieBanner.classList.add('is-hidden')
    } 
    
    if (lang === 'en') {
      acceptButton.innerHTML = "I Accept"
      cookieBanner.innerHTML = '<p class="col-xs-12 col-sm-9">We use cookies to recognize your repeat visits and preferences as well as to measure the effectiveness of our website and analyze traffic.  To learn more about cookies and how we use them, please view our '
      + '<a href="/en-us/terms-conditions/">Terms of Use</a>. '
      + 'By clicking "I Accept", or by using our site, you consent to the use of cookies.</p>';
    } else {
      acceptButton.innerHTML = "同意及接受"
      cookieBanner.innerHTML = '<p class="col-xs-12 col-sm-9">為提供最佳個人化瀏覽體驗及有效地分析網站流量，本網站透過使用"Cookies"記錄與存取你的瀏覽使用訊息。若你使用本網站，即表示你同意我們上述Cookies聲明。更多Cookies資訊請參閱本網站之'
      + '<a href="/zh-hk/terms-conditions">條款及細則</a>。</p>';
    }
    cookieBanner.appendChild(acceptButton)
    document.body.appendChild(cookieBanner);
  }

  // =======
  // Browser not support
  // =======
  if(!checkIsBrowserValid()) {
    browserNotSupportModal.style.display = "block";
  }
  
  browserNotSupportModalButton.onclick = function() {
    browserNotSupportModal.style.display = "none";
  }
  
  // =======
  // fitvids
  // =======
  fitvids();

  // ================
  // Lazy load images
  // ================
  lazyLoad = newLazyLoad();

  // ========================================
  // Modify header when scrolled
  // ========================================
  window.addEventListener('scroll', (event) => {
    // Modify header
    window.scrollY > 56 ? addClass('.header', 'is-scrolled') : '';
    window.scrollY <= 46 ? removeClass('.header', 'is-scrolled') : '';
    
    // Progressbar
    if (progressbar) {
      if (config.enable_progress_bar) {
        var scrollTop = document.querySelector('.post')["scrollTop"] ||
                        document.documentElement["scrollTop"] || 
                        document.body["scrollTop"];

        var scrollBottom = ( document.querySelector('.post')["scrollHeight"] ||
                            document.documentElement["scrollHeight"] ||
                            document.body["scrollHeight"]) - 
                            document.documentElement.clientHeight;

        scrollPercent = Math.round(scrollTop / scrollBottom * 100) + "%";
        document.getElementById("progress").style.setProperty("--scroll", scrollPercent);
      } else {
        progressbar.style.display = "none";
      }
    }

    if (config.enable_scroll_top) {
      // Scroll Top function
      window.scrollY > 200 ? addClass('.scroll-to-top', 'is-active') 
                           : removeClass('.scroll-to-top', 'is-active');
    }
    
  }, false);

  // =============
  // Scroll Top
  // =============
  if (scrollTop) {
    scrollTop.onclick = (evt) => {
      // window.scrollTo({top: 0, behavior: 'smooth'}); // not supported in all browsers
      scrollToTop();
    }
  }

  // =======================================
  // Key press event handling
  // =======================================
  window.onkeydown = (evt) => {
    const sourceClass = evt.srcElement.className;

    switch(evt.key) {
      case 'Escape':
        removeClass('.menu', 'is-active');
        removeClass('.search', 'is-active');
        bodyScrollLock.enableBodyScroll(searchModal);
        break;
      default:
        break;// nothing to do
    }
  }

  // ============
  // Menu actions
  // ============
  if (menuOpen && menuClose) {
    menuOpen.onclick = () => {
      addClass('.menu', 'is-active');
      bodyScrollLock.disableBodyScroll(menuModal);
    }
  
    menuOpen.onkeydown = (evt) => {
      if (evt.key === 'Enter' || evt.keyCode === '13') {
        addClass('.menu', 'is-active');
        bodyScrollLock.disableBodyScroll(menuModal);
        menuClose.focus();
      }
    }

    menuClose.onclick = () => {
      removeClass('.menu', 'is-active');
      bodyScrollLock.enableBodyScroll(menuModal);
    }
  
    menuClose.onkeydown = (evt) => {
      if (evt.key === 'Escape' || evt.keyCode === '27' || 
          evt.key === 'Enter' || evt.keyCode === '13') {
        removeClass('.menu', 'is-active');
        bodyScrollLock.enableBodyScroll(menuModal);
        menuOpen.focus();
      }
    }
  }
  
  // ==============
  // Search actions
  // ==============

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  if (searchOpen && searchClose) {
    searchOpen.onclick = () => {
      addClass('.search', 'is-active');
      bodyScrollLock.disableBodyScroll(searchModal);
      searchField.focus();
    };
  
    searchOpen.onkeydown = (evt) => {
      if (evt.key === 'Enter' || evt.keyCode === '13') {
        addClass('.search', 'is-active');
        bodyScrollLock.disableBodyScroll(searchModal);
        searchField.focus();
      }
    }

    searchClose.onclick = () => {
      removeClass('.search', 'is-active');
      bodyScrollLock.enableBodyScroll(searchModal);
    };
  
    searchClose.onkeydown = (evt) => {
      if (evt.key === 'Escape' || evt.keyCode === '27' || 
          evt.key === 'Enter' || evt.keyCode === '13') {
        removeClass('.search', 'is-active');
        bodyScrollLock.enableBodyScroll(searchModal);
        searchOpen.focus();
      }
    }
  }

  if ( searchField && searchForm ) {
    searchField.onfocus = () => {
      addClass('.search__form', 'focused');
    };
  
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
    }, false);
  
    searchField.onblur = () => {
      removeClass('.search__form', 'focused');
    };

    let pagination = null;
    let loading = false;
    let ghostAPI = new GhostContentAPI({
        url: config.ghost_url,
        key: config.ghost_key,
        version: 'v3'
    });
    function setLoading() {
      loading = true;
      const div = document.createElement('div');
      div.innerHTML = '<img class="search-result__loading" src="/assets/images/loading.svg" />';
      searchResults.appendChild(div.firstChild);
    }
    function unsetLoading() {
      loading = false;
      const divs = document.querySelectorAll('.search-result__loading');
      divs.forEach(div => {
        searchResults.removeChild(div);
      });
    }
    function search(val, page) {
      let value = val;
      value = value.replace(/[\+\(\)\[\]\>\<\,=%-?]+/g, '');
      value = value.replace(/^[\*\~\"\'\\\_@-]+|[\*\~\"\'\\\_@-]+$/g, '');
      if (value.length === 0 || loading || (pagination && (page > pagination.pages))) {
        return;
      }
      setLoading();
      ghostAPI.posts
        .browse({
          limit: 20,
          fields: 'title,slug,published_at,feature_image',
          include: 'tags,authors',
          filter: 'search:' + value.replace(/\s+/g, '_') + '+tag:-[hash-rolling-banner,hash-faq]',
          order: 'published_at DESC',
          page: page
        })
        .then((data) => {
          pagination = data.meta.pagination;
          delete data.meta;
          if (pagination.total === 0) {
            searchResults.innerHTML = '';
            let p = document.createElement('p');
            p.setAttribute('class', 'search-result__no-result');
            if (lang === 'en') {
              p.innerHTML = 'Your search for ' + searchField.value +' did not find any results.';
            } else {
              p.innerHTML = '沒有符合' + searchField.value +'的搜尋結果。';
            }
            searchResults.appendChild(p);
            return;
          }
          if (pagination.page === 1) {
            searchResults.innerHTML = '';
          }
          data.forEach((post) => {
            const date = new Date(post.published_at);
            const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
            const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
            const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
            const modifiedDate = `${da} ${mo} ${ye}`;
            const div = document.createElement('div');
            div.innerHTML = `<a href="${langPrefix}/${post.slug}" class="search-result__post animate fade-in-up">`
              + `<div class="search-result__content">`
              + `<h5 class="search-result__title">${parseLocaleString(post.title, lang)}</h5>`
              + `<p class="search-result__date">${modifiedDate}</p>`
              + `</div>`
              + (post.feature_image ? `<img class="search-result__image" src="${post.feature_image}" />` : '')
              + `</a>`;
              searchResults.appendChild(div.firstChild);  
          });
          const reachedBottom = searchResults.offsetTop + searchResults.clientHeight >= searchModal.clientHeight;
          if (!reachedBottom && pagination) {
            unsetLoading();
            search(searchField.value, pagination.page + 1);
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          unsetLoading();
        });
    }

    const debouncedSearch = debounce(function(e) {
      search(e.target.value, 1);
    }, 1000);

    searchField.addEventListener('input', function(e) {
      pagination = null;
      debouncedSearch(e);
    }, false);

    searchModal.addEventListener('scroll', function() {
      const reachedBottom = searchModal.scrollTop + searchModal.clientHeight >= searchModal.scrollHeight;
      if (reachedBottom && pagination) {
        search(searchField.value, pagination.page + 1);
      }
    });
  }

  if ( searchByTags ) {
    searchByTags.forEach((el) => {
      el.onclick = (evt) => {
        searchField.value = evt.srcElement.innerText;
        searchField.dispatchEvent(new Event('input'));
      }

      el.onkeydown = (evt) => {
        if (evt.key === 'Enter' || evt.keyCode === '13') { 
          searchField.value = evt.srcElement.innerText;
          searchField.dispatchEvent(new Event('input'));
        }
      }
    });
  }

  // =============
  // Theme actions
  // =============
  if (darkSwitch && lightSwitch) {
    darkSwitch.onclick = () => {
      setTheme('dark');
    }
  
    darkSwitch.onkeydown = (evt) => {
      if (evt.key === 'Enter' || evt.keyCode === '13') {
        setTheme('dark');
        lightSwitch.focus();
      }
    }
  
    lightSwitch.onclick = () => {
      setTheme('light');
    }
  
    lightSwitch.onkeydown = (evt) => {
      if (evt.key === 'Enter' || evt.keyCode === '13') {
        setTheme('light');
        darkSwitch.focus();
      }
    }
  }

  // =======================================
  // Message Box handling 
  // =======================================
  if (msgBoxes) {
    if ( msgBoxes.length === 1 ) {
      msgBoxes.onclick = (evt) => {
        closePopup(el);
      }
    }
    else {
      msgBoxes.forEach((el) => {
        el.onclick = (evt) => {
          closePopup(el);
        }
      });
    }
  }

  // ===============
  // Members Scripts
  // ===============
  // Give the parameter a variable name
  const action = getParameterByName('action');
  const stripe = getParameterByName('stripe');

  switch (action) {
    case 'subscribe':
      // addClass('body', 'subscribe-success');
        document.body.classList.add('subscribe-success')
      break;
    case 'signup': 
      window.location = '/signup/?action=checkout';
      break;
    case 'checkout':
      // addClass('body', 'signup-success');
      // addClass('form[data-members-form]', 'success');
      document.body.classList.add('signup-success');
      break;
    case 'signin':
      // addClass('body', 'signin-success');
      // addClass('form[data-members-form]', 'success');
      document.body.classList.add('signin-success');
      break;
    default:
      break;
  }

  if (stripe == 'success') {
    // addClass('body', 'checkout-success');
    document.body.classList.add('checkout-success');
  }

  // Reset form on opening subscrion overlay
  if (subscribeButton) {
    subscribeButton.onclick = function(event){
      document.querySelector('.subscribe-overlay form').className = '';
      document.querySelector('.subscribe-email').value = '';
    };
  }

  // =======================================
  // Disable load more posts button 
  // =======================================
  if (loadMoreBtn && global.max_pages === 1) {
    loadMoreBtn.hidden = true;
    loadMoreBtn.classList.add('is-hidden');
  }
  
  if(tagLoadMoreBtn) {
    tagLoadMoreBtn.hidden = true;
    tagLoadMoreBtn.classList.add('is-hidden');
  }

  // ===============
  // Load More Posts
  // ===============
  if (loadMoreBtn) {
    loadMoreBtn.onclick = () => {
      loadMorePosts(loadMoreBtn);
    }
  }
  
  if(tagLoadMoreBtn) {
    tagLoadMoreBtn.onclick = () => {
      fetchTagPosts(tagPagePostsContainer, tagLoadMoreBtn, lang)
    }
  }
  
  if(tagPagePostsContainer) {
    fetchFilter(tagPagePostsContainer, lang, ['format', 'author']).then(() => {
      fetchTagPosts(tagPagePostsContainer, tagLoadMoreBtn, lang)
    })

    const tagFormatSelector = tagPagePostsContainer.querySelector('[data-tag-format-select]')
    const tagAuthorSelector = tagPagePostsContainer.querySelector('[data-tag-author-select]')

    if(tagFormatSelector) {
      tagFormatSelector.onchange = (e) => {
        // Re-fetch author filter options
        fetchFilter(tagPagePostsContainer, lang, ['author']).then(() => {
          clearTagPagePostsContainer(tagPagePostsContainer)
          fetchTagPosts(tagPagePostsContainer, tagLoadMoreBtn, lang)
        })
      }
    }
    
    if(tagAuthorSelector) {
      tagAuthorSelector.onchange = (e) => {
        // Re-fetch format filter options
        fetchFilter(tagPagePostsContainer, lang, ['format']).then(() => {
          clearTagPagePostsContainer(tagPagePostsContainer)
          fetchTagPosts(tagPagePostsContainer, tagLoadMoreBtn, lang)
        })
      }
    }
  }
  // ======================
  // Post Table of Contents
  // ======================
  if (postToc) {
    const tocToggle = document.querySelector('.js-toc-toggle');

    if (tocToggle) {
      tocToggle.onclick = (evt) => {
        toggleClass('.js-toc', 'is-active');
        toggleClass('.js-toc-icon', 'is-rotated');
      }
    }

    tocbot.init({
      // Where to render the table of contents.
      tocSelector: '.js-toc',
      // Where to grab the headings to build the table of contents.
      contentSelector: '.js-toc-content',
      // Which headings to grab inside of the contentSelector element.
      headingSelector: 'h1, h2, h3',
      // For headings inside relative or absolute positioned containers within content.
      hasInnerContainers: true,
    });
  }

  // =============
  // Image Gallery
  // =============
  images.forEach(function (image) {
    if (config.enable_image_lightbox) {
      var wrapper = document.createElement('a');
      wrapper.setAttribute('data-no-swup', '');
      wrapper.setAttribute('data-fslightbox', '');
      wrapper.setAttribute('data-type', 'image');
      wrapper.setAttribute('href', image.src);
      wrapper.setAttribute('aria-label', 'Click for Lightbox');
      image.parentNode.insertBefore(wrapper, image.parentNode.firstChild);
      wrapper.appendChild(image);
    }
    image.setAttribute('class', 'lazyload lazy');
    // image.setAttribute('data-src', image.src);
    // image.removeAttribute('src');
    updateLazyLoad(lazyLoad);
  });

  galleryImages.forEach(function (image) {
    image.setAttribute('alt', 'Gallery Image');
    var container = image.closest('.kg-gallery-image');
    var width = image.attributes.width.value;
    var height = image.attributes.height.value;
    var ratio = width / height;
    container.style.flex = ratio + ' 1 0%';
  })
  
  // =============
  // Lightbox
  // =============
  refreshFsLightbox();

  // ==================
  // Social Share Logic
  // ==================
  if (socialShare.length > 0) {
    jsShareable(socialShare);
  }
  
  // ==================
  // Rolling Banner
  // ==================
  if (rollingBanner) {
    new Glide('.rolling-banner-glide', {
      type: 'carousel',
      autoplay: 3000
    }).mount();  
  }

  // ==================
  // Language Buttons
  // ==================
  languageButtons.forEach(button => {
    const buttonLang = button.getAttribute('data-lang');
    const buttonLangPrefix = getLanguagePrefixByLanguage(buttonLang);
    button.addEventListener('click', () => {
      window.location.href = window.location.href.replace(langPrefix, buttonLangPrefix);
    });
  });

  // ==================
  // Language Buttons
  // ==================
  if (postContent) {
    postContent.querySelectorAll('a').forEach(ele => {
      ele.target = '_blank';
    });
  }
  
  // ============================
  // Page Tag: Mobile Action
  // ============================
  if (mainTags && isSmallDevice()) {
    mainTags.forEach(mainTag => {
      const mainTagHeader = mainTag.querySelector('[data-page-tags__main-tag-header]')
      const mainTagContent = mainTag.querySelector('[data-page-tags__main-tag-content]')
      const collapsedIcon = mainTag.querySelector('[data-collapsed-icon]')
      const expandedIcon = mainTag.querySelector('[data-expanded-icon]')
      
      mainTagContent.classList.add('is-hidden')
      
      mainTagHeader.onclick = () => {
        if(mainTagContent.classList.contains('is-hidden')) {
          expandedIcon.classList.remove('is-hidden')
          mainTagContent.classList.remove('is-hidden')
          collapsedIcon.classList.add('is-hidden')
          mainTagHeader.classList.add('main-tag-header-extend')
        } else {
          expandedIcon.classList.add('is-hidden')
          mainTagContent.classList.add('is-hidden')
          collapsedIcon.classList.remove('is-hidden')
          mainTagHeader.classList.remove('main-tag-header-extend')
        }
      }
    })
  }
  
  // ============================
  // Sub tag navigation
  // ============================ 
  if(subTagNavigator) {
    const subTagContainer = subTagNavigator.querySelector('[data-sub-tag-container]')
    const leftOverlay = subTagNavigator.querySelector('[data-left-overlay]')
    const rightOverlay = subTagNavigator.querySelector('[data-right-overlay]')
    const subTags = subTagNavigator.querySelectorAll('.nav-children')
    const spaces = subTagNavigator.querySelectorAll('.space')

    if(isSmallDevice()) {
      leftOverlay.classList.add('is-hidden')
      if (subTagContainer.offsetWidth >= subTagContainer.scrollWidth && leftOverlay && rightOverlay) {
        rightOverlay.classList.add('is-hidden')
      }
      
      if(subTags) {
        subTags[0].classList.add('left-border-radius')
        subTags[subTags.length - 1].classList.add('right-border-radius')  
      }
  
      subTagContainer.addEventListener('scroll', function() {
        if(subTagContainer.scrollHeight - 4 <= subTagContainer.scrollLeft) {
          rightOverlay.classList.add('is-hidden')
        } else {
          rightOverlay.classList.remove('is-hidden')
        } 
        
        if(subTagContainer.scrollLeft >= 4) {
          leftOverlay.classList.remove('is-hidden')
        } else {
          leftOverlay.classList.add('is-hidden')
        }
      })
    } else {
      leftOverlay.classList.add('is-hidden')
      rightOverlay.classList.add('is-hidden')
      spaces.forEach(space => space.classList.add('is-hidden'))
    }
  }
};

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  callback();
} else {
  document.addEventListener("DOMContentLoaded", callback);
}

// ===============================
// Dark/Light mode theme handling
// ===============================
const setTheme = (sTheme) => {
  document.documentElement.setAttribute('data-color-scheme', sTheme);
  localStorage.setItem('USER_COLOR_SCHEME', sTheme);
}

// ===============================
// Class modifying helepers
// ===============================
const toggleClass = (el, cls) => {
  document.querySelector(el).classList.toggle(cls);
}

const addClass = (el, cls) => {
  document.querySelector(el).classList.add(cls);
}

const removeClass = (el, cls) => {
  document.querySelector(el).classList.remove(cls);
}

// ===============================
// Scroll to function
// ===============================
const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
};

// ===============================
// Check if element is in viewport
// ===============================
function isInViewport(el) {
  let top = el.offsetTop;
  let left = el.offsetLeft;
  let width = el.offsetWidth;
  let height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return(
    top < (window.pageYOffset + window.innerHeight) &&
    left < (window.pageXOffset + window.innerWidth) &&
    (top + height) > window.pageYOffset &&
    (left + width) > window.pageXOffset
  );
}

// =================
// Lazyload function
// =================
function newLazyLoad() {
  return new LazyLoad({
    elements_selector: ".lazyload",
    class_loading: "loading",
    class_loaded: "loaded",
    treshold: 100,
    // use_native: true,
    callback_enter: function(el) {
      el.classList.add('loading');
    },
    callback_set: function(el) {
      el.classList.remove('loading');
      el.classList.add('loaded');
    }
  });
}

function updateLazyLoad(lazyLoad) {
  lazyLoad.update();
}

// =================
// Close popup
// =================
const closePopup = (el) => {
  el.parentNode.parentNode.classList.add('is-closed');
  setTimeout(function(){
    el.parentNode.parentNode.style.display = "none";
  }, 1000); 
}

// =================
// Copy to clipboard
// =================
const copyToClipboard = (src, str) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

  src.classList.add('has-tooltip');
  src.setAttribute('data-label', 'Copied!');

  src.onmouseleave = () => { 
    src.classList.remove('has-tooltip');
    setTimeout(function(){
      src.setAttribute('data-label', '');
    }, 500); 
  }
};

// ==============
// Social Sharing
// ==============
function jsShareable(socialShare) {
  if (socialShare.length > 1) {
    socialShare.forEach((el) => {
      let title = el.getAttribute('data-title');
      let url = el.getAttribute('data-url');
      let type = el.getAttribute('data-type');
      
      jsShare(el, title, url, type);
    });
  } else {
    let title = socialShare.getAttribute('data-title');
    let url = socialShare.getAttribute('data-url');
    let type = socialShare.getAttribute('data-type');

    jsShare(socialShare, title, url, type);
  }
}

function jsShare (el, title, url, type) {
  let shareLink;

  switch(type) {
    case 'twitter':
      shareLink = 'https://twitter.com/intent/tweet?text=' + title + '&url=' + encodeURIComponent(url);
      break;
    case 'facebook':
      shareLink = 'https://www.facebook.com/sharer/sharer.php?u='+ url;
      break;
    case 'linkedin':
      shareLink = 'https://www.linkedin.com/shareArticle?mini=true&url=' + url + '&title=' + title + '&summary=' + title;
      break;
    case 'whatsapp':
      shareLink = 'https://api.whatsapp.com/send?text=' + url ;
      break;
    case 'telegram':
      shareLink = 'https://t.me/share/url?url=' + url + '&text=' + title
      break;
    case 'email':
      el.onclick = () => {
        location.href = el.getAttribute('href');
      }
      el.onkeydown = (evt) => {
        if (evt.key === 'Enter') {
          location.href = el.getAttribute('href');
        }
      }
      break;
    case 'copy': 
      el.onclick = () => {
        copyToClipboard(el, location.href);
      }
      el.onkeydown = (evt) => {
        if (evt.key === 'Enter') {
          copyToClipboard(el, location.href);
        }
      }
      break;
    default:
      break;
  }

  if (shareLink) {
    el.onclick = () => {
      socialWindow(shareLink);
    }

    el.onkeydown = (evt) => {
      if (evt.key === 'Enter') {
        socialWindow(shareLink);
      }
    }
  }
}

const socialWindow = (url) => {
  var left = (screen.width - 580) / 2;
  var top = (screen.height - 580) / 2;
  var params = "menubar=no,toolbar=no,status=no,width=580,height=296,top=" + top + ",left=" + left;
  window.open(url,"NewWindow",params);
}; 

// ===================
// Read next page link
// ===================
const nextPage = document.querySelector('link[rel=next]');
if (nextPage) {
  global.pagination_next_page_link = nextPage.getAttribute('href')
} else {
  // if last page disable button
  if (global.pagination_current_page === global.pagination_max_pages) {
    const loadMore = document.querySelector('#load-more-posts');
    if (loadMore) {
      loadMore.hidden = true;
      loadMore.classList.add('is-hidden');  
    }
  }
}

// ===============
// Load More Posts
// ===============
const loadMorePosts = (button) => {
  // Update current page value
  if (nextPage && global.pagination_next_page <= global.pagination_max_pages) {
    const fetchLink = global.pagination_next_page_link

    // Fetch next page content
    fetch(fetchLink).then(function (response) {
      // Fetch Successfull
      return response.text();
    }).then(function (html) {
      // Store original scrollTop
      const originalScrollTop = document.documentElement.scrollTop;

      // Convert the HTML string into a document object
      // DomParser can't convert svg element with svg namespace (https://css-tricks.com/sketchy-avatars-css-clip-path/#comment-1586732)
      const tempPostContainer = document.createElement('div');
      tempPostContainer.innerHTML = html;
      
      // Get posts
      const posts = tempPostContainer.querySelectorAll('.post-wrap');
      const postContainer  = document.querySelector('.posts');
      
      // Add each post to the page
      posts.forEach(post => {
        postContainer.appendChild(post);
      })
      
      // Update lazyload for images
      updateLazyLoad(lazyLoad);

      // Disable button on last page
      if (global.pagination_next_page === global.pagination_max_pages) {
        button.hidden = true;
        button.classList.add('is-hidden');
      }

      // Update next page number
      global.pagination_next_page = global.pagination_next_page + 1
      let nextLink = global.pagination_next_page_link.split("/")
      nextLink[nextLink.length - 2] = global.pagination_next_page
      global.pagination_next_page_link = nextLink.join("/")

      // Reset scroll position after adding post items
      document.documentElement.scrollTop = originalScrollTop;
    }).catch(function (err) {
      // There was an error
      console.warn('Something went wrong.', err);
    });
  } 
  else {
    // No more pages, hide button
    button.hidden = true;
    button.classList.add('is-hidden');
  }
}

// ================================
// Fetch Tag Post
// ================================
function fetchTagPosts(tagPagePostsContainer, button, lang) {
  const tagSlugFilterString = tagPagePostsContainer.querySelector('[data-tags-slug-filter-string]') && tagPagePostsContainer.querySelector('[data-tags-slug-filter-string]').innerText 
  const postsCounter = tagPagePostsContainer.querySelector('[data-posts-counter]')
  const tagPagePosts = tagPagePostsContainer.querySelector('[data-tag-posts]');
  const formatTagSelector = tagPagePostsContainer.querySelector('[data-tag-format-select]');
  const formatTagSlug = formatTagSelector ? formatTagSelector.value : null
  const tagAuthorSelector = tagPagePostsContainer.querySelector('[data-tag-author-select]');
  const tagAuthor = tagAuthorSelector ? tagAuthorSelector.value : null

  function setLoading() {
    button.hidden = true;
    button.classList.add('is-hidden');
    const div = document.createElement('div');
    div.innerHTML = '<img class="tag-post-loading" src="/assets/images/loading.svg" />';
    tagPagePostsContainer.appendChild(div.firstChild);
  }
  
  function unsetLoading() {
    const div = document.querySelectorAll('.tag-post-loading');
    div.forEach(div => {
      tagPagePostsContainer.removeChild(div);
    });
  }
  
  let ghostAPI = new GhostContentAPI({
    url: config.ghost_url,
    key: config.ghost_key,
    version: 'v3'
  })
  setLoading()
  ghostAPI.posts.browse({
    limit: global.pagination_posts_per_page,
    include: 'tags,authors',
    filter: `tag:[${tagSlugFilterString}]${formatTagSlug ? `+tag:${formatTagSlug}` : ''}${tagAuthor ? `+primary_author:${tagAuthor}`: ''}`,
    order: 'published_at DESC',
    page: global.tag_pagination_next_page || 1
  })
  .then((data) => {
    const { total, next } = data.meta.pagination
    if(total === 0) {
      postsCounter.innerHTML = lang === 'en' ? 'No Resources' : '未有項目資源'
    } else {
      if (lang === 'en') {
        if(total === 1) postsCounter.innerHTML = `${total} Resource`;
        else postsCounter.innerHTML = `${total} Resources`;
      } else {
        postsCounter.innerHTML = `${total}項資源`;
      }
    }
    global.tag_pagination_next_page = next;
    
    delete data.meta;

    if(tagPagePosts) {
      const originalScrollTop = document.documentElement.scrollTop;
      data.forEach(post => {
        const div = generatePostCard(post, lang)
        tagPagePosts.appendChild(div);
      });
      document.documentElement.scrollTop = originalScrollTop;
    }
    
    if(next === null) {
      button.hidden = true;
      button.classList.add('is-hidden');
    } else {
      button.hidden = false;
      button.classList.remove('is-hidden');
    }
  }).finally(() => {
    unsetLoading();
  });
}

function fetchFilter(tagPagePostsContainer, lang, type) {
  const tagSlugFilterString = tagPagePostsContainer.querySelector('[data-tags-slug-filter-string]') && tagPagePostsContainer.querySelector('[data-tags-slug-filter-string]').innerText 
  const formatTagSelector = tagPagePostsContainer.querySelector('[data-tag-format-select]');
  const formatTagSlug = formatTagSelector ? formatTagSelector.value : null
  const tagAuthorSelector = tagPagePostsContainer.querySelector('[data-tag-author-select]');
  const tagAuthor = tagAuthorSelector ? tagAuthorSelector.value : null
  
  let ghostAPI = new GhostContentAPI({
    url: config.ghost_url,
    key: config.ghost_key,
    version: 'v3'
  })
  
  let fetchFormatFilter = Promise.resolve()
  let fetchAuthorFilter = Promise.resolve()

  if(type.includes('format')) {
    fetchFormatFilter = ghostAPI.tags.browse({
      limit: 'all',
      filter: `tag_sub_tag:[${tagSlugFilterString}]${tagAuthor ? `+tag_author:${tagAuthor}`: ''}+visibility:public+parent_id:${global.format_tag_id}`,
    }).then((formatsTags) => {
      delete formatsTags.meta;
       
      clearFormatTagSelector(formatTagSelector, lang)
      formatsTags.forEach(tag => {
        const option = generateFormatTagOption(tag, lang);
        formatTagSelector.appendChild(option);
      })
      
      if(formatTagSlug && formatsTags.map(tag => tag.slug).includes(formatTagSlug)) {
        formatTagSelector.value = formatTagSlug;
      } else {
        formatTagSelector.value = '';
      }
    })
  }
  
  if(type.includes('author')) {
    fetchAuthorFilter = ghostAPI.authors.browse({
      limit: 'all',
      filter: `author_sub_tag:[${tagSlugFilterString}]${formatTagSlug ? `+author_tag:${formatTagSlug}` : ''}`
    }).then((authors) => {
      delete authors.meta;

      clearAuthorSelector(tagAuthorSelector, lang)
      authors.forEach(author => {
        const options = generateAuthorOption(author, lang);
        tagAuthorSelector.appendChild(options);
      })
      
      if(tagAuthor && authors.map(author => author.slug).includes(tagAuthor)) {
        tagAuthorSelector.value = tagAuthor;
      } else {
        tagAuthorSelector.value = '';
      }
    })
  }
  return Promise.all([fetchFormatFilter, fetchAuthorFilter])
}

function clearTagPagePostsContainer(tagPagePostsContainer) {
  global.tag_pagination_next_page = null

  const tagPagePosts = tagPagePostsContainer.querySelector('[data-tag-posts]');
  if(tagPagePosts) {
    tagPagePosts.innerHTML = ''
  }
}

function clearFormatTagSelector(formatTagSelector, lang) {
  formatTagSelector.innerHTML = `<option value="">${lang === 'en' ? 'All Formats' : '全部形式'}</option>`
}

function clearAuthorSelector(tagAuthorSelector, lang) {
  tagAuthorSelector.innerHTML = `<option value="">${lang === 'en' ? 'All Projects/NGOs' : '全部項目/機構'}</option>`
}
// ================================
// Members Parse the URL parameter
// ================================
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function checkIsBrowserValid() {
  const userAgentString = navigator.userAgent;

  const isIE = (userAgentString.indexOf("MSIE") > -1) || (userAgentString.indexOf("Trident") > -1);

  return !isIE;
}

// ================================
// Language Prefix
// ================================
function getLanguagePrefixByLanguage(lang) {
  switch (lang) {
    case 'en':
      return '/en-us';
    case 'zh-Hant':
      return '/zh-hk';
    default:
      throw new Error('Unknown lang: ' + lang);
  }
}

// ================================
// Check small device width
// ================================
function isSmallDevice() {
  const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  return width < 576
}

// ================================
// Locale String
// ================================
function parseLocaleString(localeString, lang) {
  if (!localeString || localeString.indexOf('|') === -1) {
      return localeString;
  }

  const [enName, zhName] = localeString.split('|');
  switch (lang) {
    case 'en':
      return enName;
    case 'zh-Hant':
      return zhName;
    default:
      throw new Error('Unknown lang: ' + lang);
  }
}

// ================================
// Generate Post card for tag
// ================================
function generatePostCard(post, lang) {
  const div = document.createElement('div');
  div.classList.add("col-xs-12", "col-md-6", "col-lg-4", "post-wrap")
        
  const date = new Date(post.published_at);
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
  const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
  const mozH = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(date);
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
  const modifiedDate = lang ==='en' ? `${da} ${mo} ${ye}`: `${ye}年${mozH}月${da}日`;
  const langPrefix = getLanguagePrefixByLanguage(lang);

  div.innerHTML = `<div class="post-card col tag"><div class="special-bg"></div>`
  + `<a class="post-card__image" href="${langPrefix}/${post.slug}" title=${parseLocaleString(post.title, lang)}>`
  + (post.feature_image ? `<img src="${post.feature_image}"/>`: `<img src="/assets/images/cover-placeholder.png" />`)
  + `</a>`
  + `<div class="post-card__content">`
  + `<h2 class="post-card__title">`
  + `<a href="${post.url}" title="${parseLocaleString(post.title, lang)}">${parseLocaleString(post.title, lang)}</a>`
  + `</h2>`
  + `<div class="post-card__details">`
  + `<div class="post-card__authors is-flex ${post.authors.length > 1 ? "multi" : ""}">`
  + (post.authors.map(author => { 
    return `<div class="post-card__author">${author.profile_image ? 
      `<a href=${author.url} class="post-card__author-image"><img src="${author.profile_image}" /></a>` :
      `<a href=${author.url} class="post-card__author-icon"><i class="icon icon-user"><svg class="icon__svg"><use xlink:href="/assets/icons/feather-sprite.svg#user"></use></svg></i></a>`}</div>`
    })).join('')
  + `</div>`
  + `<div class="post-card__info">`
  + `<div class="post-card__author-names">${post.authors.map(author => `<a href="${author.url}">${processAuthorName(author.name, lang)}</a>`).join('')}`
  + `</div>`
  + `<time datetime=${modifiedDate} class="post-card__date">${modifiedDate}</time>`
  + `</div>`
  + `</div>`
  + `</div>`
  + `</div>`
  return div
}

function generateFormatTagOption(tag, lang) {
  const option = document.createElement('option');
  option.value = tag.slug;
  option.innerText = parseLocaleString(tag.name, lang);
  
  return option;
}

function generateAuthorOption(author, lang) {
  const option = document.createElement('option');
  option.value = author.slug;
  option.innerText = processAuthorName(author.name, lang);
  
  return option;
}

function processAuthorName(rawAuthorName, lang) {
  const index = rawAuthorName.indexOf('\\\\');
  if (index === -1) {
      return parseLocaleString(rawAuthorName.trim(), lang);
  }
  const authorName = parseLocaleString(rawAuthorName.substring(0, index).trim(), lang);
  const orgName = parseLocaleString(rawAuthorName.substring(index + 2).trim(), lang);

  if (authorName) {
      return authorName + ', ' + orgName;
  } else {
      return orgName;
  }
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(';');
  for(let i=0;i < cookies.length;i++) {
      let c = cookies[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}