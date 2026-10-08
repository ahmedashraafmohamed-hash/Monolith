---
tags:
  - project
  - planning
status: In progress
owner: Web team
due: 2026-12-03
---

# Website redesign plan

This plan covers the redesign of the company website. The current site is **slow to load** and hard to use on a phone, so the goal is a *simpler structure*, faster pages and an editing workflow the content team can run on its own. Dates are in the [[Project timeline]], the page inventory is in the [[Content audit]], and open issues are under [[#Risks]]. Accessibility follows the [WCAG contrast guidance](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html). The launch moved from ~~15 November~~ to ==3 December== after the audit, and ***nothing ships without review***. Work is tracked under #project/website.[^1]

> [!summary] Summary
> The redesign reduces page weight, simplifies navigation and moves editing to a shared workflow. Launch is planned for 3 December.

## Goals

The sponsor summed up the brief in one sentence:

> The new site should load quickly, read well on a phone and be easy for anyone on the team to update.

- Simplify the site structure
  - Merge overlapping pages
    - Redirect the old addresses
- Improve page speed
- Make editing easier for the content team

### Success measures

1. Pages load in under two seconds on a mid-range phone
2. The content team publishes without developer help
3. Support requests about navigation drop by half

> [!info] Scope
> Blog archives and the support site are out of scope for this phase.

#### Performance

Page weight is checked on every build with `npm run build`, and the results go to the project channel.

##### Baseline

Measured on the current site in September.

###### Data source

Analytics export, reviewed monthly.

## Schedule and capacity

Weekly capacity is $C = n \times h \times f$, where $n$ is the number of people, $h$ the hours each person works per week and $f$ the share of that time spent on the project. The number of weeks follows from the total work $W$:

$$
\text{weeks} = \frac{W}{n \times h \times f}
$$

With four people working 30 hours a week at $f = 0.6$, capacity is $C = 72$ hours. The 264 hours below take about 3.7 weeks.

> [!example] Worked example
> One designer at 30 hours a week and $f = 0.6$ has 18 hours of capacity.

| Phase | Owner | Estimate | Status |
| --- | --- | --- | --- |
| Research | Product | 40 h | Done |
| Design | Design | 80 h | In progress |
| Build | Engineering | 120 h | Planned |
| Launch | Operations | 24 h | Planned |

> [!note] Review schedule
> Design reviews run on Tuesdays and build reviews on Thursdays.

The same calculation in code:

```python
def weeks_needed(total_hours, people, hours_each, focus):
    capacity = people * hours_each * focus
    return total_hours / capacity

# 264 hours of work, four people, 30 hours a week, 60% focus
print(round(weeks_needed(264, 4, 30, 0.6), 1))  # 3.7
```

## Tasks

- [x] Interview stakeholders
- [x] Audit the existing pages
- [ ] Draft the new site structure
- [ ] Review designs with the team
- [ ] Prepare the launch checklist

> [!todo] Follow up
> Confirm hosting costs with finance.

> [!question] Open question
> Who approves the final copy: marketing or the product owner?

> [!success] Done
> The content audit is complete and every page has an owner.

---

## Risks

> [!warning] Content delivery
> Late copy is the most likely cause of delay, because every later phase depends on it.

> [!danger] Blocker
> The domain registration expires on 20 November, before the planned launch. Renew it now.

> [!failure] Missed target
> The first staging build failed the two-second load test.

> [!bug] Known issue
> The navigation menu stays open on a phone after the screen rotates.

> [!tip] Before launch
> Share the staging link with a few people outside the team to catch problems the team no longer notices.

> [!quote] Customer feedback
> I could not find the pricing page on my phone.

> [!faq]- Why not launch in November?
> The audit found 40 pages that needed rewriting, and the content team could not finish them before the original date.
>
> > [!note] Decision
> > The sponsor approved the move to 3 December.

## ملخص بالعربية

يهدف هذا المشروع إلى **تبسيط بنية الموقع** وتحسين *سرعة التحميل* وتسهيل التصفح على الهاتف. عدد الأسابيع المطلوبة يساوي $W / C$ حيث $W$ إجمالي ساعات العمل و$C$ الطاقة الأسبوعية للفريق.

> [!tip] ملاحظة
> راجع الجدول الزمني قبل كل اجتماع أسبوعي.

### الخطوات

- مراجعة المحتوى الحالي
- إعداد نموذج أولي
- إطلاق الموقع الجديد

[^1]: Agreed with the marketing team and confirmed by the project sponsor.
