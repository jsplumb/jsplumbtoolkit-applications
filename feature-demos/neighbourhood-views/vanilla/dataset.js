const data = {
  "organic-compound": {
    id: "organic-compound",
    label: "Organic compound",
    children: {
      hydrocarbon: {
        label: "Hydrocarbon",
        children: {
          saturated: {
            label: "Saturated",
            children: {
              methane: {
                label: "Methane",
                formula: "CH4"
              },
              pentane: {
                label: "Pentane",
                formula: "C5H12"
              },
              hexane: {
                label: "Hexane",
                formula: "C6H14"
              },
              heptane: {
                label: "Heptane",
                formula: "C7H16"
              }
            }
          },
          unsaturated: {
            label: "Unsaturated",
            children: {
              ethylene: {
                label: "Ethylene",
                formula: "C2H4"
              },
              benzene: {
                label: "Benzene",
                formula: "C6H6"
              },
              acetylene: {
                label: "Acetylene",
                formula: "C2H2"
              }
            }
          }
        }
      },
      "ring-system": {
        id: "ring-system",
        label: "Ring system",
        children: {
          monocycle: {
            label: "Monocycle",
            children: {
              benzene: {
                label: "Benzene",
                formula: "C6H6"
              },
              cyclohexane: {
                label: "Cyclohexane",
                formula: "C6H12"
              },
              cycloheptane: {
                label: "Cycloheptane",
                formula: "C7H14"
              },
              furane: {
                label: "Furane",
                formula: "C4H4O"
              }
            }
          },
          polycycle: {
            id: "polycycle",
            label: "Polycycle",
            children: {
              naphthalene: {
                label: "Naphthalene",
                formula: "C10H8"
              },
              anthracene: {
                label: "Anthracene",
                formula: "C14H10"
              },
              phenanthrene: {
                label: "Phenanthrene",
                formula: "C14H10",
                children: {
                  chrysene: {
                    label: "Chrysene",
                    formula: "C18H12"
                  },
                  pyrene: {
                    label: "Pyrene",
                    formula: "C16H10"
                  }
                }
              }
            }
          }
        }
      },

      "functional-group": {
        label: "Functional group",
        children: {
          "o-compound": {
            label: "O-compound",
            children: {
              alcohol: {
                label: "Alcohol",
                formula: "R-OH",
                children: {
                  methanol: {
                    label: "Methanol",
                    formula: "CH3OH"
                  },
                  ethanol: {
                    label: "Ethanol",
                    formula: "C2H5OH"
                  },
                  glycerol: {
                    label: "Glycerol",
                    formula: "C3H8O3"
                  }
                }
              },
              phenol: {
                label: "Phenol",
                formula: "C6H5OH"
              },
              ether: {
                label: "Ether",
                formula: "R-O-R",
                children: {
                  "dimethyl-ether": {
                    label: "Dimethyl ether",
                    formula: "CH3-O-CH3"
                  },
                  "diethyl-ether": {
                    label: "Diethyl ether",
                    formula: "C2H5-O-C2H5"
                  }
                }
              },
              ester: {
                label: "Ester",
                formula: "R-COO-R",
                children: {
                  "methyl-acetate": {
                    label: "Methyl acetate",
                    formula: "CH3-COO-CH3"
                  },
                  "ethyl-acetate": {
                    label: "Ethyl acetate",
                    formula: "C2H5-COO-C2H5"
                  }
                }
              }
            }
          },
          "n-compound": {
            label: "N-compound",
            children: {
              amine: {
                label: "Amine",
                formula: "R-NH2"
              },
              aniline: {
                label: "Aniline",
                formula: "C6H5NH2"
              },
              amide: {
                label: "Amide",
                formula: "R-CONH2"
              }
            }
          },
          "s-compound": {
            label: "S-compound",
            children: {
              sulfide: {
                label: "Sulfide",
                formula: "R-S-R"
              },
              sulfoxide: {
                label: "Sulfoxide",
                formula: "R-SO-R"
              },
              sulfone: {
                label: "Sulfone",
                formula: "R-SO2-R"
              }
            }
          },
          "p-compound": {
            label: "P-compound",
            children: {
              ether: {
                label: "Ether",
                formula: "R-O-R",
                children: {
                  "dimethyl-ether": {
                    label: "Dimethyl ether",
                    formula: "CH3-O-CH3"
                  },
                  "diethyl-ether": {
                    label: "Diethyl ether",
                    formula: "C2H5-O-C2H5"
                  }
                }
              },
              ester: {
                label: "Ester",
                formula: "R-COO-R",
                children: {
                  "methyl-acetate": {
                    label: "Methyl acetate",
                    formula: "CH3-COO-CH3"
                  },
                  "ethyl-acetate": {
                    label: "Ethyl acetate",
                    formula: "C2H5-COO-C2H5"
                  }
                }
              },
              amide: {
                label: "Amide",
                formula: "R-CONH2",
                children: {
                  acetamide: {
                    label: "Acetamide",
                    formula: "CH3-CONH2"
                  },
                  benzamide: {
                    label: "Benzamide",
                    formula: "C6H5-CONH2"
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

export default data
