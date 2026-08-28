import { WebComponent } from 'web-component-base'

/**
 * @see https://webcomponent.io/prop-access/#opt-in-typed-props-in-typescript
 */
type MastodonContentProps = {
  server: string
  tagUrl: string
}

/**
 * Enhances a Mastodon status's `content` HTML, given as this element's own
 * light-DOM children (server-rendered, or otherwise already in the DOM).
 * @see https://mastodon-content.webcomponent.io
 */
export class MastodonContent extends WebComponent<MastodonContentProps> {
  static props: MastodonContentProps = {
    server: '',
    tagUrl: '',
  }

  // override render() so the children are not wiped
  render() {}

  onInit() {
    const el = this.getElementsByClassName('hashtag')
    const { server, tagUrl } = this.props
    // no local route configured: send the tag back to the server's own UI
    const effectiveTagUrl = tagUrl || `${server}/tags/`

    for (let i = 0; i < el.length; i++) {
      const tagEl = el.item(i) as HTMLAnchorElement
      const currentHref = tagEl.getAttribute('href') ?? ''
      const tagName = currentHref.replace(`${server}/tags/`, '')
      tagEl.setAttribute('href', effectiveTagUrl + tagName)

      const parentEl = tagEl.parentElement
      if (!parentEl) continue

      const siblings = parentEl.childNodes
      let validSiblingsCount = 0

      for (const sibling of siblings) {
        if (!(sibling.nodeType === 3 && sibling.textContent === ' ')) {
          validSiblingsCount++
        }
      }

      const childrenTags = parentEl.getElementsByClassName('hashtag')
      const isTagBar = validSiblingsCount === childrenTags.length

      if (isTagBar) {
        parentEl.classList.add('tag-bar')
        tagEl.textContent = tagName
        tagEl.classList.add('pill')
      }
    }
  }
}

customElements.define('mastodon-content', MastodonContent)
