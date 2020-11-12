/**
 *
 * @description class to model helper methods for blog posts
 * @export
 * @class BlogPostHelper
 */
class BlogPostHelper {
  /**
   * @method generateSlug
   * @description generates a slug for an blog post when given the title;
   * @static
   * @param {string} title
   * @returns {string} slug generated string with a random number
   * @memberof BlogPostHelper
   */
  static generateSlug(title) {
    const formattedTitle = title.split(' ').join('-');
    const randomNumber = Math.floor(Math.random() * 100000);
    return `${formattedTitle.toLowerCase()}-${Date.now()}-${randomNumber}`;
  }

  /**
   * @method getReadTime
   * @description Calculate how many minutes it takes to read a block of text
   * @static
   * @param {string} text
   * @returns {number} amount of minutes it takes to read a block of text
   * @memberof BlogPostHelper
   */
  static getReadTime(text) {
    const articleLength = text.split(' ').length;
    const time = articleLength / 200;
    return Math.round(time);
  }
}

export default BlogPostHelper;
