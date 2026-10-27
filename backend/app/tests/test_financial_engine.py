import pytest
from app.schemas.financial import FinancialInputs
from app.services.financial_engine import FinancialEngine

def test_unit_economics_standard():
    econ = FinancialEngine.calculate_unit_economics(selling_price=280.0, variable_cost=70.0)
    assert econ.selling_price == 280.0
    assert econ.variable_cost_per_unit == 70.0
    assert econ.contribution_per_unit == 210.0
    assert econ.contribution_margin_pct == 75.0
    assert "Excellent Gross Margin" in econ.gross_margin_status

def test_unit_economics_zero_or_negative_margin():
    econ_neg = FinancialEngine.calculate_unit_economics(selling_price=50.0, variable_cost=60.0)
    assert econ_neg.contribution_per_unit == -10.0
    assert econ_neg.contribution_margin_pct == -20.0
    assert "Negative Contribution" in econ_neg.gross_margin_status

    with pytest.raises(ValueError):
        FinancialEngine.calculate_unit_economics(selling_price=0.0, variable_cost=10.0)

def test_break_even_attainable():
    be = FinancialEngine.calculate_break_even(
        fixed_monthly_costs=200000.0,
        selling_price=300.0,
        variable_cost=100.0,
        target_monthly_sales=1500
    )
    # Contribution = 200. Break-even = 200,000 / 200 = 1,000 units.
    assert be.break_even_units == 1000
    assert be.break_even_revenue == 300000.0
    assert be.is_attainable is True
    assert be.margin_of_safety_units == 500
    assert be.margin_of_safety_pct == 33.33

def test_break_even_unattainable_when_target_too_low():
    be = FinancialEngine.calculate_break_even(
        fixed_monthly_costs=300000.0,
        selling_price=250.0,
        variable_cost=100.0,
        target_monthly_sales=1200
    )
    # Contribution = 150. Break-even = 300,000 / 150 = 2,000 units.
    assert be.break_even_units == 2000
    assert be.is_attainable is False
    assert be.margin_of_safety_units == -800

def test_break_even_negative_contribution():
    be = FinancialEngine.calculate_break_even(
        fixed_monthly_costs=100000.0,
        selling_price=50.0,
        variable_cost=75.0,
        target_monthly_sales=500
    )
    assert be.is_attainable is False
    assert be.break_even_units == 999999

def test_12_month_projections_and_scenarios():
    inputs = FinancialInputs(
        selling_price=250.0,
        variable_cost_per_unit=60.0,
        fixed_monthly_costs=150000.0,
        initial_startup_investment=1200000.0,
        target_monthly_sales=1400,
        tax_rate=0.18
    )
    report = FinancialEngine.run_full_model(inputs)
    
    assert len(report.projections_12_months) == 12
    m1 = report.projections_12_months[0]
    m12 = report.projections_12_months[11]
    
    # Month 1 ramp-up is 40%
    assert m1.units_sold == int(1400 * 0.40)
    assert m12.units_sold > m1.units_sold
    
    # Scenarios compare correctly: Optimistic > Base > Conservative
    assert report.optimistic_scenario.annual_revenue > report.base_scenario.annual_revenue
    assert report.base_scenario.annual_revenue > report.conservative_scenario.annual_revenue
    assert len(report.methodology_notes) >= 5
