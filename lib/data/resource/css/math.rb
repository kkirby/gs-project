module Sass::Script::Functions
  extend Sass::Script::Value::Helpers

  PI = number(Math::PI)
  E = number(Math::E)

  def pi()
    PI
  end
  declare :pi, []

  def sin(number)
    trig(:sin, number)
  end
  declare :sin, [:number]

  def asin(number)
    trig(:asin, number)
  end
  declare :asin, [:number]

  def cos(number)
    trig(:cos, number)
  end
  declare :cos, [:number]

  def acos(number)
    trig(:acos, number)
  end
  declare :acos, [:number]

  def tan(number)
    trig(:tan, number)
  end
  declare :tan, [:number]

  def atan(number)
    trig(:atan, number)
  end
  declare :atan, [:number]

  def e
    E
  end
  declare :e, []

  def logarithm(number, base = e )
    assert_type number, :Number
    assert_type base, :Number
    raise Sass::SyntaxError, "base to logarithm must be unitless." unless base.unitless?

    result = Math.log(number.value, base.value) rescue Math.log(number.value) / Math.log(base.value)
    number(result, number.unit_str)
  end
  declare :logarithm, [:number]
  declare :logarithm, [:number, :base]

  def sqrt(number)
    numeric_transformation(number) { |n| Math.sqrt(n) }
  end
  declare :sqrt, [:number]

  alias square_root sqrt
  declare :square_root, [:number]

  def pow(number, exponent)
    assert_type number, :Number
    assert_type exponent, :Number
    raise Sass::SyntaxError, "exponent to pow must be unitless." unless exponent.unitless?
    number(number.value**exponent.value, number.unit_str)
  end
  declare :pow, [:number, :exponent]
  
  # Exponents
    def exponent(base, powerNum, powerDen)
      base = base.value.to_f
      powerNum = powerNum.value.to_f
      powerDen = powerDen.value.to_f
      result = base ** (powerNum / powerDen)
      Sass::Script::Number.new(result)
    end
    def power(base, exponent)
      base = base.value.to_f
      exponent = exponent.value.to_f
      result = base ** exponent
      Sass::Script::Number.new(result)
    end
    def sqrt(number)
      number = number.value.to_f
      result = Math.sqrt(number)
      Sass::Script::Number.new(result)
    end
    def nth_root(number, root)
      number = number.value.to_f
      root = root.value.to_f
      result = number ** (1.0 / root)
      Sass::Script::Number.new(result)
    end
    # Logarithms
    def ln(num)
      result = Math.log(num.value)
      Sass::Script::Number.new(result)
    end
    def log10(num)
      result = Math.log10(num.value)
      Sass::Script::Number.new(result)
    end
    # Miscellaneous
    def factorial(number)
      result = 1
      number = number.value
      if number > 0
        (1..number).each do |i|
          result = result * i
        end 
      end 
      Sass::Script::Number.new(result)
    end
    def random(max = Sass::Script::Number.new(100)) ## shamelessly taken from here: https://gist.github.com/1561650
      Sass::Script::Number.new(rand(max.value), max.numerator_units, max.denominator_units)
    end
    def hypot(a, b)
      a = a.value.to_f
      b = b.value.to_f
      result = Math.hypot(a, b)
      Sass::Script::Number.new(result)
    end
    # Constants
    def pi
      pi = Math::PI
      Sass::Script::Number.new(pi)
    end
    def e
      e = Math::E
      Sass::Script::Number.new(e)
    end
    def golden_ratio()
      result = (1.0 / 2.0) + (Math.sqrt(5) / 2.0)
      Sass::Script::Number.new(result)
    end
    # Comparative Functions
    def is_int(number)
      number = number.value.to_f
      if number - number.floor != 0
        result = false
      else
        result = true
      end
      Sass::Script::Bool.new(result)
    end
    def is_float(number)
      number = number.value
      if number - number.floor != 0
        result = true
      else
        result = false
      end
      Sass::Script::Bool.new(result)
    end
    # Trigonometric Functions
    def deg_to_rad(degree)
      result = degree.value.to_f * Math::PI / 180
      Sass::Script::Number.new(result)
    end
    def rad_to_deg(rad)
      result = rad.value.to_f * 180 / Math::PI
      Sass::Script::Number.new(result)
    end
    def cosh(rad)
      rad = rad.value.to_f
      result = Math.cosh(rad)
      Sass::Script::Number.new(result)
    end
    def acos(rad)
      rad = rad.value.to_f
      result = Math.acos(rad)
      Sass::Script::Number.new(result)
    end
    def acosh(rad)
      rad = rad.value.to_f
      result = Math.acosh(rad)
      Sass::Script::Number.new(result)
    end
    def sinh(rad)
      rad = rad.value.to_f
      result = Math.sinh(rad)
      Sass::Script::Number.new(result)
    end
    def asin(rad)
      rad = rad.value.to_f
      result = Math.asin(rad)
      Sass::Script::Number.new(result)
    end
    def asinh(rad)
      rad = rad.value.to_f
      result = Math.asinh(rad)
      Sass::Script::Number.new(result)
    end
    def tanh(rad)
      rad = rad.value.to_f
      result = Math.tanh(rad)
      Sass::Script::Number.new(result)
    end
    def atan(rad)
      rad = rad.value.to_f
      result = Math.atan(rad)
      Sass::Script::Number.new(result)
    end
    def atan2(y, x)
      y = y.value.to_f
      x = x.value.to_f
      result = Math.atan2(y, x)
      Sass::Script::Number.new(result)
    end
    def atanh(rad)
      rad = rad.value.to_f
      result = Math.atanh(rad)
      Sass::Script::Number.new(result)
    end
  
  
  private
  def trig(operation, number)
    if number.unit_str == "deg"
      number(Math.send(operation, Math::PI * number.value / 180))
    else
      number(Math.send(operation, number.value), number.unit_str)
    end
  end
end
