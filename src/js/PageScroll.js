export class PageScroll {
  constructor(leftBtn, rightBtn, scrollTarget) {
    this.leftBtn = leftBtn;
    this.rightBtn = rightBtn;
    this.scrollTarget = scrollTarget;
    this.currentPage = 0;
    this.numPages = scrollTarget.childElementCount;

    this.init();
  }

  init() {
    if (this.numPages > 1) {
      this.enableBtn(this.rightBtn);
    }

    this.leftBtn.addEventListener("click", () => {
      if (this.currentPage === 0) return;

      this.scrollTarget.style.transform = `translateX(${-100 *
        --this.currentPage}%)`;

      this.enableBtn(this.rightBtn);

      if (this.currentPage === 0) {
        this.disableBtn(this.leftBtn);
      }
    });

    this.rightBtn.addEventListener("click", () => {
      if (this.currentPage === this.numPages - 1) return;

      this.scrollTarget.style.transform = `translateX(${-100 *
        ++this.currentPage}%)`;

      this.enableBtn(this.leftBtn);

      if (this.currentPage === this.numPages - 1) {
        this.disableBtn(this.rightBtn);
      }
    });
  }

  enableBtn(btn) {
    btn.removeAttribute("disabled");
  }
  disableBtn(btn) {
    btn.setAttribute("disabled", true);
  }
}
